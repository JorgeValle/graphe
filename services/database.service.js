'use strict';

/**
 * Returns the right Mongo connection string, depending on environment
 */
module.exports.returnDbConnectionString = function() {
  
  if (process.env.NODE_ENV === 'production') {
    return process.env.MONGOLAB_URI;
  } else {
    return 'mongodb://admin:3K5E2erBuQN8tj2y@ds141890-a0.mlab.com:41890,ds141890-a1.mlab.com:41890/jorgevalle?replicaSet=rs-ds141890';
  }

};