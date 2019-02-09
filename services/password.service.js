{
  'use strict';

  /**
   * Returns the right API password, depending on environment
   * @since 3.0.0
   * @returns {string} - The password
   */
  module.exports.returnApiPassword = () => {
    
    if (process.env.NODE_ENV === 'production') {
      return process.env.API_PASSWORD;
    } else {
      return 'whatpassword';
    }

  }
}