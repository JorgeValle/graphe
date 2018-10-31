'use strict';

const request = require('request'),
      serverService = require('../services/server.service');

/**
 * 
 */
const renderUpdateContent = function(req, res, thisPost) {

  res.render('update', {
    documentTitle: 'Update | Antares',
    // we parse JSON response to get properties ready for consumption in pug templates
    post: JSON.parse(thisPost)
  });
};


/**
 * 
 */
const renderQueryContent = function(req, res, posts, quotes, events) {

  res.render('query', {
    documentTitle: 'Query | Antares',
    // we parse JSON response to get properties ready for consumption in pug templates
    posts: JSON.parse(posts),
    quotes: JSON.parse(quotes),
    events: JSON.parse(events)
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
module.exports.queryAll = function(req, res) {

  var path = '/api/get/posts',
      fullUrl = serverService.returnBaseUrl() + path,
      requestOptions = {
        url: fullUrl,
        method: 'get'
      };

  // let's get the posts
  request(requestOptions, function(err, response, posts) {

    if (err) {
      console.log('Request error' + err);
    } else {

      var path = '/api/get/quotes',
          fullUrl = serverService.returnBaseUrl() + path,
          requestOptions = {
            url: fullUrl,
            method: 'get'
          };

      // now let's get the quotes
      request(requestOptions, function(err, response, quotes) {

        if (err) {
          renderQueryContent(req, res, posts);
        } else {

          var path = '/api/get/events',
              fullUrl = serverService.returnBaseUrl() + path,
              requestOptions = {
                url: fullUrl,
                method: 'get'
              };

          request(requestOptions, function(err, response, events) {

            if (err) {
              renderQueryContent(req, res, posts, quotes)
            } else {
              renderQueryContent(req, res, posts, quotes, events);
            }

          });
        }
      });
    }
  });

};

/**
 * Updates
 * @param {*} req 
 * @param {*} res 
 * @returns
 */
module.exports.queryOne = function(req, res) {

  var wantedSlug = req.query.post,
      path = `/api/get/post/${wantedSlug}`,
      fullUrl = serverService.returnBaseUrl() + path,
      requestOptions = {
        url: fullUrl,
        method: 'get'
      };

  request(requestOptions, function(err, response, body) {

    if (err) {
      console.error(`Request error: ${err}`);
    } else {
      console.log('renderUpdateContent ran');
      renderUpdateContent(req, res, body);
    }

  });
};