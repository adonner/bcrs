/*
============================================
; Title: api-security-questions
; Author: Troy Martin
; Date: 01/08/2019
; Modified By: Adam Donner
; Description: Security Questions API
;===========================================
*/
// start program
const express = require('express');
const SecurityQuestion = require('../db-models/security-question')

// declare the express router object
const router = express.Router();

/*
; Params: none
; Response: all security questions
; Description: FindAll - finds all security questions that are not disabled
*/
router.get('/', (request, response) => {

  // Using the find method of the security question model return all questions that are not disabled
  SecurityQuestion.find({ isDisabled: false }, (err, res) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('security-questions api', 'An error occurred finding the security questions', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // set the status code to 200, OK and return the response
      response.status(200).send(res);
    }
  });
});

/*
; Params: id: Security question id
; Response: security question by id
; Description: FindById - finds a security question by id
*/
router.get('/:id', (request, response, next) => {

  // Using the findOne method of the security question model return a security question based on provided id
  SecurityQuestion.findOne({'_id': request.params.id}, (err, securityQuestion) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('security-questions api', 'An error occurred finding that security question', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return security question
      console.log('security-questions api', securityQuestion);
      response.json(securityQuestion);
    }
  });
});

/*
; Params: id: security question id
; Response: all security questions
; Description: UpdateSecurityQuestions - updates an existing security question
;   does not update disabled questions or the isDisabled flag
;   to delete a security question use the delete method
*/
router.put('/:id', (request, response) => {
  // Declare the question id and get the value off the url if it exists
  var questionId = request.params && request.params.id ? request.params.id : null;

  // if the questionId was not defined then return a bad request response
  if (!questionId) {
    // set the status code to 400, bad request and send a message
    response.status(400).send('Request has invalid or missing the question id.');
  } else {
    // Using the findOne method of the security question model search for a matching question id
    // could include a filter for isDisabled to ensure they are not updated?
    SecurityQuestion.findOne({ _id: questionId, isDisabled: false }, (err, res) => {
      // if there is an error
      if (err) {
        // log the error to the console
        console.log('security-questions api', 'An error occurred finding the security question', err);
        // return an http status code 500, server error and the error
        response.status(500).send(err);
      } else {
        // if a matching question is not found res will be null
        if (!res) {
          // set the status code to 400 bad request and return a message
          response.status(400).send('Invalid question, not found.');
        } else {
          // ignore isDisabled and use delete to soft delete the question
          res.text = request.body.text;

          // save the question
          res.save(null, (err, doc) => {
            // if there is an error
            if (err) {
              // log the error to the console
              console.log('security-questions api', 'An error occurred updating security question', err);
              // set the status code to 400, bad request and send the error message
              response.status(500).send(err.message);
            } else {
              // set the status code to 200, OK and return the updated question
              response.status(200).send(doc.toJSON());
            }
          });
        }
      }
    });
  }

});

/*
; Params: id: Security question id
; Response: updated security question
; Description: DeleteSecurityQuestion - sets a status of isDisabled to a security question by id
*/
router.delete('/:id', (request, response, next) => {

  // Using the findOne method of the security question model return a security question based on provided id
  SecurityQuestion.findOne({'_id': request.params.id}, (err, securityQuestion) => {
    // if there is an error
    if (err) {
      // log the error to the console
      console.log('security-questions api', 'An error occurred finding that security question', err);
      // return an http status code 500, server error and the error
      response.status(500).send(err);
    } else {
      // return security question
      console.log('security-questions api', securityQuestion);

      if (securityQuestion) {
        securityQuestion.set({
          isDisabled: true
        });

        securityQuestion.save((err, savedSecurityQuestion) => {
          if (err) {
            // log the error to the console
            console.log('security-questions api', 'An error occurred finding that security question', err);
            // return an http status code 500, server error and the error
            response.status(500).send(err);
          } else {
            console.log('security-questions api', savedSecurityQuestion);
            // return saved security question
            response.json(savedSecurityQuestion);
          }
        })
      }
    }
  });
});

/**
 * CreateSecurityQuestion - Errors to Log
 */
router.post('/', function(req, res, next) {
  let sq = {
    text: req.body.text
  };

  SecurityQuestion.create(sq, function (err, securityQuestion) {
    if (err) {
      console.log('security-questions api', err);
      return next(err);
    } else {
      console.log('security-questions api', securityQuestion);
      res.json(securityQuestion);
    }
  })
});

/**
 * FindSecurityQuestionsByIds
 */
router.post('/find-by-ids', function(req, res, next) {
  const question1 = req.body.question1;
  const question2 = req.body.question2;
  const question3 = req.body.question3;

  SecurityQuestion.find({
    $or: [
      {'_id': question1},
      {'_id': question2},
      {'_id': question3},
    ]
  }).exec(function (err, securityQuestions) {
    if (err) {
      console.log('security-questions api', err);
      return next(err);
    } else {

      // return the security questions in the proper order
      const questions = [
        {id:req.body.question1, text: '' },
        {id:req.body.question2, text: '' },
        {id:req.body.question3, text: '' }
      ];

      // we need to return the questions in the proper order
      questions.forEach((q) => {
        // find the question that matches the id
        const mq = securityQuestions.find((sq) => {
          return sq.id === q.id;
        });
        if(mq){
          q.text = mq.text;
        }
      })

      res.status(200).json(questions);
    }
  })
});



// export the router
module.exports = router;

// end program
