{

  'use strict';

  const mongoose = require('mongoose'),
        databaseService = require('../services/database.service');
  
  /**
   * Gracefully closes connection to database
   * @since 2.0.0
   * @async
   */
  const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
      console.log(`Mongoose disconnected through ${msg}`);
      callback();
    });
  };
  
  // Connect to database
  mongoose.connect(databaseService.returnDbConnectionString(), { useNewUrlParser: true });
  
  // Trigger on database connection
  mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${databaseService.returnDbConnectionString()}`);
  });
  
  // Logs on database connection error
  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
  });
  
  // Logs on database disconnection
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
  
  // Kills process 
  process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
  
  process.once('SIGINT', () => {
    gracefulShutdown('app termination', () => {
      process.exit(0);
    });
  });
  
  process.once('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
      process.exit(0);
    });
  });
  
  // Bringing in models
  require('./models/posts.model');
  require('./models/events.model');
  require('./models/quotes.model');

}