/*
============================================
; Title: invoice-api
; Author: Troy Martin
; Date: 01/21/2020
; Modified By: Troy Martin
; Description: Invoice API
;===========================================
*/

// start program
const express = require('express');
const Invoice = require('../db-models/invoice');

// declare the express router object
const router = express.Router();

/*
; Params: invoice data
; Response: Invoice JSON data
; Description: CreateInvoice - Creates an invoice in MongoDB
*/
router.post('/:username', (request, response, next) => {
  // get the username
  const username = request.params.username;

  // create invoice object for MongoDB

  let invoice = {
    items: request.body.lineItems,
    partsTotal: request.body.partsAmount,
    laborTotal: request.body.laborAmount,
    lineItemTotal: request.body.lineItemTotal,
    invoiceTotal: request.body.total,
    username: username,
    dateOrdered: request.body.orderDate
  };

  console.log('invoice api', 'create invoice', invoice);

  const n = new Invoice(invoice);

  // Creates the invoice document
  n.save((err, newInvoice) => {
    // If error return the error
    if (err) {
      console.log('invoice api', 'create invoice', err);
      return next(err);
    } else {
      console.log('invoice api', 'create invoice', newInvoice);
      // return JSON results
      response.status(201).json(newInvoice);
    }
  })
});

/*
; Params: none
; Response: [{_id: {service, price}, count: 1}]
; Description: Return a data set representing the services and the number sold
*/
router.get('/purchases-graph', (request, response) => {
  Invoice.aggregate([
    {
      '$unwind': {
        'path': '$items'
      }
    }, {
      '$group': {
        '_id': {
          'service': '$items.service.description',
          'price': '$items.service.price'
        },
        'quantity': {
          '$sum': '$items.quantity'
        }
      }
    }, {
      '$sort': {
        '_id': 1
      }
    }
  ],(err, items) => {
    if (err) {
      console.log('invoice api', 'purchases by service', err);
      response.status(500).send();
    } else {
      response.status(200).json(items);
    }

  });
});


// export the router
module.exports = router;

// end program
