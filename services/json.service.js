{
  'use strict';

  /**
   * Constructs a JSON response
   * @since 2.0.0
   * @param {string} res - The response object
   * @param {string} status - The status object
   * @param {string} content - The actual content for response
   */
  module.exports.sendResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };
}