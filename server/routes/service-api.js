/*
============================================
; Title: service-api
; Author: Troy Martin
; Date: 01/19/2019
; Modified By: Troy Martin
; Description: Service API
;===========================================
*/
// start program
const express = require('express');
const Service = require('../db-models/service');

// declare the express router object
const router = express.Router();

/*
; Params: none
; Response: all services
; Description: FindAll - finds all services that are not disabled
*/
router.get('/', (request, response) => {

  // Using the find method of the service model return all services that are not disabled
  Service.find({ isDisabled: false }, (err, res) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('services api', 'An error occurred finding the services', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      console.log('services api', res);
      // set the status code to 200, OK and return the response
      response.status(200).send(res);
    }
  });
});

/*
; Params: id: Service id
; Response: service by id
; Description: FindById - finds a service by id
*/
router.get('/:id', (request, response, next) => {

  // Using the findOne method of the service model return a service based on provided id
  Service.findOne({'_id': request.params.id}, (err, service) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('services api', 'An error occurred finding that service', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return service
      console.log('services api', service);
      response.json(service);
    }
  });
});

/*
; Params: id: service
; Response: updated service
; Description: UpdateServices - updates an existing service
;   does not update disabled service or the isDisabled flag
;   to delete a service use the delete method
*/
router.put('/:id', (request, response) => {
  // Declare the service id and get the value off the url if it exists
  var serviceId = request.params && request.params.id ? request.params.id : null;

  // if the serviceId was not defined then return a bad request response
  if (!serviceId) {
    // set the status code to 400, bad request and send a message
    response.status(400).send('Request has invalid or missing the service id.');
  } else {
    // Using the findOne method of the service model search for a matching service id
    // could include a filter for isDisabled to ensure they are not updated?
    Service.findOne({ _id: serviceId, isDisabled: false }, (err, res) => {
      // if there is an error
      if (err) {
        // log the error to the console
        console.log('services api', 'An error occurred finding the service', err);
        // return an http status code 500, server error and the error
        response.status(500).send(err);
      } else {
        // if a matching service is not found res will be null
        if (!res) {
          // set the status code to 400 bad request and return a message
          response.status(400).send('Invalid service, not found.');
        } else {
          // ignore isDisabled and use delete to soft delete the service
          res.description = request.body.description;
          res.price = request.body.price;

          // save the service
          res.save(null, (err, doc) => {
            // if there is an error
            if (err) {
              // log the error to the console
              console.log('services api', 'An error occurred updating service', err);
              // set the status code to 500, server error and send the error message
              response.status(500).send(err.message);
            } else {
              // set the status code to 200, OK and return the updated service
              response.status(200).send(doc.toJSON());
            }
          });
        }
      }
    });
  }

});

/*
; Params: id: Service id
; Response: disabled service
; Description: DeleteService - sets a status of isDisabled to a service by id
*/
router.delete('/:id', (request, response, next) => {

  // Using the findOne method of the service model return a service based on provided id
  Service.findOne({'_id': request.params.id}, (err, service) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('services api', 'An error occurred finding that service', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return service
      console.log('services api', service);

      if (service) {
        service.set({
          isDisabled: true
        });

        service.save((err, res) => {
          if (err) {
            // log the error to the console
            console.log('services api', 'An error occurred finding that service', err);
            // return an http status code 500, server error and the error
            response.status(500).send(err);
          } else {
            console.log('services api', res);
            // return saved service
            response.json(res);
          }
        })
      }
    }
  });
});

/**
 * CreateService - Errors to Log
 */
router.post('/', function(req, res, next) {
  console.log('services api', req.body);
  let service = {
    description: req.body.description,
    price: req.body.price
  };

  Service.create(service, function (err, doc) {
    if (err) {
      console.log('services api', err);
      res.status(400).send();
      return next(err);
    } else {
      console.log('services api', doc);
      res.status(201).json(doc).send();
    }
  })
});


// export the router
module.exports = router;
