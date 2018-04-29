'use strict';

const request = require('request'),
      serverService = require('../services/server.service');

// object for request options
let requestOptions = {
  method: 'GET',
  json: {}
}

/**
 * 
 */
const renderUpdateContent = function(req, res, responseBody) {
  res.render('update', {
    documentTitle: 'Update | Antares' ,
    // we parse JSON response to get properties ready for consumption in pug templates
    apiResponse: responseBody
  });
};


/**
 * 
 */
const renderQueryContent = function(req, res, responseBody) {

  console.log(responseBody);

  res.render('query', {
    documentTitle: 'Query | Antares' ,
    // we parse JSON response to get properties ready for consumption in pug templates
    apiResponse: responseBody
  });
};

/**
 * Renders the create page
 * @param {*} req 
 * @param {*} res 
 */
module.exports.create = function(req, res) {
  res.render('create', { 
    documentTitle: 'Create | Antares'
  });
};

/**
 * Get all from content type
 * @param {string} res - the test value
 * @param {string} status - the status response
 * @returns
 */
module.exports.query = function(req, res) {

  const path = '/api/get/posts';

  // adding the url to hit
  requestOptions.url = serverService.returnBaseUrl() + path;

  request(requestOptions, function(err, response, body) {

    if (err) {
      console.log(`Request error: ${err}`);
    } else {
      renderQueryContent(req, res, body);
    }

  });

};

/**
 * Updates
 * @param {*} req 
 * @param {*} res 
 * @returns
 */
module.exports.update = function(req, res) {

  const wantedSlug = req.query.post,
        path = `/api/get/post/${wantedSlug}`;

  // adding the url to hit
  requestOptions.url = serverService.returnBaseUrl() + path;

  request(requestOptions, function(err, response, body) {

    if (err) {
      console.error(`Request error: ${err}`);
    } else {
      renderUpdateContent(req, res, body);
    }

  });
};