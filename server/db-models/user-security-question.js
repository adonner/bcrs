/*
============================================
; Title: user-security-question.js
; Author: Troy Martin
; Date: 01/06/2019
; Modified By: Reva Baumann
; Description: User security question with answer
;===========================================
*/


// start program

const mongoose = require('mongoose');

/**
 * Declare user security question schema
 */
let userSecurityQuestionSchema = mongoose.Schema({
    id: {type: String},
    answer: {type: String}
});


// Export mongoose model

module.exports = userSecurityQuestionSchema;

// end program
