{
  'use strict';

  /**
   * Returns the right Mongo connection string, depending on environment
   * @since 2.0.0
   * @returns {string} - The database connection string
   */
  module.exports.returnDbConnectionString = () => {
    
    if (process.env.NODE_ENV === 'production') {
      return process.env.MONGOLAB_URI;
    } else {
      return process.env.MONGOLAB_URI
      // return 'mongodb://127.0.0.1:27017/JorgeValle';
    }

  };
}