/*============================================
; Title: app.js
; Author: Richard Krasso
; Modified by: Adam Donner
; Date: 6 January 2019
; Description:  Creates server and API for
; Angular application.
;===========================================
*/


// start program

/**
 * Require statements
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const securityQuestionRouter = require('./routes/security-question-api');
const userRouter = require('./routes/user-api');
const sessionRouter = require('./routes/session-api');
const serviceRouter = require('./routes/service-api');
const rolesRouter = require('./routes/roles-api');
const invoicesRouter = require('./routes/invoice-api');
const config = require('./config');
const cors = require('cors');

/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/bcrs')));
app.use('/', express.static(path.join(__dirname, '../dist/bcrs')));

// allow cross origin requests to our api
app.use(cors());

/**
 * Variables
 */
const port = config.web.port; // server port

const conn = 'mongodb+srv://admin:admin@buwebdev-cluster-1-opi0o.mongodb.net/bcrs?retryWrites=true&w=majority';


/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s)
 */
// use the security questions router
app.use('/api/security-questions', securityQuestionRouter);
// use the users router
app.use('/api/users', userRouter);
// use the sessions router
app.use('/api/sessions', sessionRouter);
// use the service router
app.use('/api/services', serviceRouter);
// use the role router
app.use('/api/roles', rolesRouter)
// use the invoices router
app.use('/api/invoices', invoicesRouter)


/**
 * Create and start server
 */
http.createServer(app).listen(port, function () {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function

// end program
