/*
============================================
; Title: <Assignment>
; Author: Troy Martin
; Date: 01/13/2019
; Modified By: Troy Martin
; Description: <Description>
;===========================================
*/
// start program
const bcrypt = require('bcrypt');
const config = require('./config');

const encryption = {};

/*
; Params: value: string
; Response: string
; Description: Encrypt the provided value
*/
encryption.encryptValue = function(value) {
  // use the bcrypt hashSync method to encrypt the value using the rounds from the configuration object
  return bcrypt.hashSync(value, config.encryption.rounds);
};

/*
; Params: value: string, encryptValue: string
; Response: boolean
; Description: Compare the string versus the encrypted value
*/
encryption.compare = function(value, encryptValue) {
  // using bcrypt compare return true or false if the values match
  return bcrypt.compareSync(value, encryptValue);
}


module.exports = encryption;
// end program
