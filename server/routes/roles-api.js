/*
============================================
; Title: api-security-questions
; Author: Adam Donner
; Date: 01/21/2019
; Modified By: Adam Donner
; Description: Roles API
;===========================================
*/
// start program
const express = require('express');
const Roles = require('../db-models/role')

// declare the express router object
const router = express.Router();

/*
; Params: none
; Response: all roles
; Description: FindAll - finds all roles that are not disabled
*/
router.get('/', (request, response) => {

  // Using the find method of the role model return all roles that are not disabled
  Roles.find({ isDisabled: false }, (err, roles) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('roles api', 'An error occurred finding the roles', err);
      return next(err);
    } else {
      console.log('roles api', roles);
      response.status(200).json(roles);
    }
  });
});

/*
; Params: id: Role id
; Response: Role by id
; Description: FindById - finds a role by id
*/
router.get('/:id', (request, response, next) => {
  // Declare the id and get the value off the url if it exists
  var id = request.params && request.params.id ? request.params.id : null;

  // if the id was not defined then return a bad request response
  if (!id) {
    // set the status code to 400, bad request and send a message
    response.status(400).send('Request is invalid or missing the id.');
  } else {
    // Using the findOne method of the role model return a role based on provided id
    Roles.findOne({ '_id': id }, (err, role) => {
      // if there is an error
      if (err) {
        // log the error to the console
        console.log('roles api', 'An error occurred finding that role', err);
        // return an http status code 500, server error and the error
        response.status(500).send(err);
      } else {
        // return role
        console.log('roles api', role);
        response.status(200).json(role);
      }
    });
  }
});

/*
; Params: none
; Response: updated role
; Description: UpdateRole - updates role
*/
router.put('/:id', (request, response, next) => {

  // Using the find one method of the role model return one role
  Roles.findOne({ '_id': request.params.id }, (err, role) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('roles api', 'An error occurred finding that role', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      role.set({
        name: request.body.name
      });

      role.save((err, role) => {
        if (err) {
          // log the error to the console
          console.log('roles api', err);
          return next(err);
        } else {
          // console.log role and respond with role JSON data
          console.log('roles api', role);
          response.json(role);
        }
      })
    }
  });
});

/*
; Params: id: role ID
; Response: updated role
; Description: DeleteRole - sets a status of isDisabled role by id
*/
router.delete('/:id', (request, response, next) => {

  // Using the findOne method of the role model return a role based on provided id
  Roles.findOne({ '_id': request.params.id }, (err, role) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('roles api', 'An error occurred finding that role', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return role
      console.log('roles api', role);

      if (role) {
        role.set({
          isDisabled: true
        });

        role.save((err, savedRole) => {
          if (err) {
            // log the error to the console
            console.log('roles api', 'An error occurred finding that role', err);
            // return an http status code 500, server error and the error
            response.status(500).send(err);
          } else {
            console.log('roles api', savedRole);
            // return saved role
            response.json(savedRole);
          }
        })
      }
    }
  });
});

/**
 * CreateRole
 */
router.post('/', function(req, res, next) {
  const r = {
    name: req.body.name
  };

  const role = new Roles(r);

  role.save(r, function(err, role) {
    if (err) {
      console.log('roles api', err);
      return next(err);
    } else {
      console.log('roles api', role);
      res.status(201).json(role);
    }
  })
});

// export the router
module.exports = router;

// end program
