'use strict';

/**
 * Returns the right Mongo connection string, depending on environment
 */
module.exports.returnApiPassword = function() {
  
  if (process.env.NODE_ENV === 'production') {
    return process.env.API_PASSWORD;
  } else {
    return 'whatpassword';
  }

}