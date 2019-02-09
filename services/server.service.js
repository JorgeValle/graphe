{
  'use strict';

  /**
   * Returns the correct base URL, depending on the environment
   * @since 3.0.0
   * @returns {string} - The base URL string
   */
  module.exports.returnBaseUrl = () => {
    
    if (process.env.NODE_ENV === 'production') {
      return 'http://jorgevalle.herokuapp.com';
    } else {
      return 'http://localhost:3000';
    }
    
  };
}