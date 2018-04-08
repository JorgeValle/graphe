'use strict';

const mongoose = require('mongoose'),
      dbURI = 'mongodb://admin:3bn8AMFgipYGibdlpVo7@ds141890-a0.mlab.com:41890,ds141890-a1.mlab.com:41890/jorgevalle?replicaSet=rs-ds141890';

// if (process.env.NODE_ENV === 'production') {
//   dbURI = process.env.MONGOLAB_URI;
// }

mongoose.connect(dbURI);

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
  console.log('Mongoose connected to ' + dbURI);
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

require('./models/pages.model');