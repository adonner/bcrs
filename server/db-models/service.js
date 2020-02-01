/*============================================
; Title: service.js
; Author: Troy Martin
; Modified: Troy Martin
; Date: 01/19/2020
; Description:  Service database model
;===========================================
*/
// start program
const mongoose = require('mongoose');

/**
 * Declare service schema
 */
let serviceSchema = mongoose.Schema({
  description:    {type: String, required: true, unique: true, dropDups: true},
  price:          {type: String, required: true},
  isDisabled:     {type: Boolean, default: false},
  date_created:   {type: Date, default: new Date()}
});

// Export mongoose model
module.exports = mongoose.model('Service', serviceSchema, 'services');
// end program
