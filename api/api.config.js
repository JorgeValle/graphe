'use strict';

const mongoose = require('mongoose'),
      databaseService = require('../services/database.service');

// connect to db
mongoose.connect(databaseService.returnDbConnectionString());

/**
 * 
 */
let gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through' + msg);
    callback();
  });
};

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + databaseService.returnDbConnectionString());
});

mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err)
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.once('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});

process.once('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function() {
    process.exit(0);
  });
});

// bringing in models
require('./models/posts.model');