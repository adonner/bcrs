/*============================================
; Title: user.js
; Author: Adam Donner
; Modified: Adam Donner
; Date: 6 January 2020
; Description:  User database model
;===========================================
*/
// start program
const mongoose = require('mongoose');

/**
 * Declare user security question schema
 */
let userSecurityQuestionSchema = mongoose.Schema({
  id: { type: String },
  answer: { type: String }
});

/**
 * Declare user database schema
 */
let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, dropDups: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  email: { type: String },
  isDisabled: { type: Boolean, default: false },
  role: { type: String, default: 'Standard' },
  date_created: { type: Date, default: new Date() },
  date_modified: { type: Date },
  SecurityQuestions: [userSecurityQuestionSchema]

});

// Export mongoose model
module.exports = mongoose.model('User', userSchema, 'users');

// end program
