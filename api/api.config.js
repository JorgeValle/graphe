{

  'use strict';

  const mongoose = require('mongoose'),
        databaseService = require('../services/database.service');
  
  /**
   * Gracefully closes connection to database
   * @since 2.0.0
   * @async
   */
  const gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      console.log('Mongoose disconnected through' + msg);
      callback();
    });
  };
  
  // Connect to database
  mongoose.connect(databaseService.returnDbConnectionString());
  
  // Trigger on database connection
  mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + databaseService.returnDbConnectionString());
  });
  
  // Logs on database connection error
  mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err)
  });
  
  // Logs on database disconnection
  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
  });
  
  // Kills process 
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
  
  // Bringing in models
  require('./models/posts.model');
  require('./models/events.model');
  require('./models/quotes.model');

}