/*
============================================
; Title: user-api
; Author: Troy Martin
; Date: 01/16/2019
; Modified By: Adam Donner
; Description: User API
;===========================================
*/
// start program
const express = require('express');
const User = require('../db-models/user')
const createUserFunction = require('./create-user.function');

// declare the express router object
const router = express.Router();

/*
; Params: none
; Response: {_id: string, username: string, password: string ...}
; Description: CreateUser - adds a user with an encrypted password
; Required: username, password
; Defaulted: date_created: new Date(), role: standard, isDisabled: false
*/
router.post('/', createUserFunction);

/*
; Params: id: User id
; Response: user by id
; Description: FindById - finds a security question by id
*/
router.get('/:id', (request, response, next) => {

  // Using the findOne method of the security question model return a security question based on provided id
  User.findOne({ '_id': request.params.id }, (err, user) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('users api', 'An error occurred finding that user', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return user
      console.log('users api', user);
      response.json(user);
    }
  });
});


/**
 * FindAll
 */
router.get('/', function (req, res, next) {
  User.find({}).where('isDisabled').equals(false).exec(function (err, users) {
    if (err) {
      console.log('users api', err);
      return next(err);
    } else {
      console.log('users api', users);
      res.json(users);
    }
  });
});

/*
; Params: id: user id
; Response: updated user
; Description: DeleteUser - sets a status of isDisabled user by id
*/
router.delete('/:id', (request, response, next) => {

  // Using the findOne method of the user model return a user based on provided id
  User.findOne({ '_id': request.params.id }, (err, user) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('users api', 'An error occurred finding that user', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return user
      console.log('users api', user);

      if (user) {
        user.set({
          isDisabled: true
        });

        user.save((err, savedUser) => {
          if (err) {
            // log the error to the console
            console.log('users api', 'An error occurred finding that user', err);
            // return an http status code 500, server error and the error
            response.status(500).send(err);
          } else {
            console.log('users api', savedUser);
            // return saved user
            response.json(savedUser);
          }
        })
      }
    }
  });
});

/**
 * UpdateUser
 */
router.put('/:id', function (req, res, next) {
  User.findOne({ '_id': req.params.id }, function (err, user) {
    if (err) {
      console.log('users api', err);
      return next(err);
    } else {
      console.log('users api', req.body);
      console.log('users api', user);

      user.set({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        role: req.body.role
      });

      user.save(function (err, savedUser) {
        if (err) {
          console.log('users api', err);
          return next(err);
        } else {
          console.log('users api', savedUser);
          res.json(savedUser);
        }
      })
    }
  })
})

/*
; Params: id: user id
; Response: Selected Security Questions
; Description: FindSelectedSecurityQuestions - returns an array of security questions based on user
*/
router.get('/:username/security-questions', (request, response, next) => {
  User.findOne({ 'username': { $regex : `^${request.params.username}$`,$options:'i' }}, (err, user) => {
    if (err) {
      console.log('users api', err);
      return next(err);
    } else {
      console.log('users api', user);
      response.json(user.SecurityQuestions);
    }
  })
});

/*
; Params: none
; Response: none
; Description: Update the users security questions
*/
router.put('/:username/security-questions', (request, response, next) => {
  User.findOne({ 'username': { $regex : `^${request.params.username}$`,$options:'i' } }, (err, user) => {
    if (err) {
      console.log('users api', err);
      return next(err);
    } else {
      console.log('users api', user);

      // if there are selected security questions add them
      if (request.body.SecurityQuestions
        && Array.isArray(request.body.SecurityQuestions)) {
        user.SecurityQuestions = [];
        request.body.SecurityQuestions.forEach((q) => {
          user.SecurityQuestions.push(q);
        });
      }

      // call the save method to store the new user in the db
      user.save((err, u) => {
        // if there is an error
        if (err) {
          // log the error
          console.log('users api', err);
          // return a server error and the message
          response.status(500).json(err.message);
        } else {
          // return the ok status code and the user
          response.status(200).json(u);
        }
      });
    }
  })
});

/*
; Params: username
; Response: string role name
; Description: Returns the role for the user
*/
router.get('/:username/role', (request, response) => {
  // Declare the username and get the value off the url if it exists
  var username = request.params && request.params.username ? request.params.username : null;

  // if the username was not defined then return a bad request response
  if (!username) {
    // set the status code to 400, bad request and send a message
    response.status(400).send('Request is invalid or missing the username.');
  } else {
    // Using the findOne method of the user model return a role based on provided username
    User.findOne({ 'username': { $regex : `^${username}$`,$options:'i' } }, (err, user) => {
      // if there is an error
      if (err) {
        // log the error to the console
        console.log('users api', 'An error occurred finding that username', err);
        // return an http status code 500, server error and the error
        response.status(500).send(err);
      } else {
        // return user role
        console.log('users api', user);
        response.status(200).json(user.role);
      }
    });
  }

});

// export the router
module.exports = router;
// end program
