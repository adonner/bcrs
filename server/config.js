/*
============================================
; Title: config
; Author: Troy Martin
; Date: 01/09/2020
; Modified By: Troy Martin
; Description: Configuration values
;===========================================
*/
// start program

// Declare the config variable
var config = {};

// Declare the config.web variable
config.web = {};
// Declare the config.web.port variable and set it to a the process port or default it to 3000
config.web.port = process.env.PORT || '3000';

// Declare the config.encryption property to store values related to encryption
config.encryption = {};
// Declare the config.encryption.secret variable and set it to a default value
config.encryption.secret = "Th3Sec3retUs3dT0Encrypt!";
// Declare the config.encryption.rounds variable and set it to a default value
config.encryption.rounds = 10;

// Export the config
module.exports = config;

// end program
