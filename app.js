"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, {useNewUrlParser: true});

// ROUTES FOR THE APP
const jokeRouter = require('./routes/joke');
app.use('/joke', jokeRouter);
const serviceRouter = require('./routes/service');
app.use('/service', serviceRouter);

// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app;