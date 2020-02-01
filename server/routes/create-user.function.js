/*
============================================
; Title: create-user
; Author: Troy Martin
; Date: 01/14/2020
; Modified By: Troy Martin
; Description: Create user common function for Users/CreateUser and Session/Register
;===========================================
*/
// start program
const express = require('express');
const encryption = require('../encryption');
const User = require('../db-models/user');

/*
; Params: request, response
; Response: none
; Description: Create the user from an express request and response
*/
createUser = function (request, response) {
  // if the request and request body are not valid return an error
  if (!request
    || !request.body) {
    response.status(400).json('Invalid request.');
  } else {

    // Using the findOne method check for an existing user by username
    User.findOne({ 'username': { $regex : `^${request.body.username}$`,$options:'i' } }, (err, existingUser) => {
      // if there is an error
      if (err) {
        // log the error to the console
        console.log('create-user','An error occurred validating the user', err);
        // return an http status code 500, server error and the error
        response.status(500).json('An error occurred validating the user', err);
        return;
      } else {
        if (existingUser) {
          console.log('create-user', 'existing user found');
          response.status(400).json(`Username ${request.body.username} is not available`);
          return;
        } else {
          // create a new user setting it to the request body
          const user = new User(request.body);
          // encrypt the users password
          if (user.password) {
            user.password = encryption.encryptValue(user.password);
          }

          // if there are selected security questions add them
          if (request.body.questions
            && Array.isArray(request.body.questions)) {
            user.SecurityQuestions = [];
            request.body.questions.forEach((q) => {
              user.SecurityQuestions.push(q);
            });
          }

          // call the save method to store the new user in the db
          user.save((err, u) => {
            // if there is an error
            if (err) {
              // log the error
              console.log('create-user', err);
              // return a server error and the message
              response.status(500).json(err.message);
            } else {
              // return the created status code and the new user
              response.status(201).json(u);
            }
          });
        }
      }
    });
  }
}

module.exports = createUser;
// end program
