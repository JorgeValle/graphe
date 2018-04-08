'use strict';

const mongoose = require('mongoose'),
      fs = require('fs');

const jsonService = require('../services/json.service');

// setting the API password for local and production environments
var apiPassword = 'whatpassword';
if (process.env.NODE_ENV === 'production') {
  apiPassword = process.env.API_PASSWORD;
}

const page = mongoose.model('Page');

/**
 * 
 * @todo This is fetching the 'pages' collection, which should have been more appropriately named 'posts' originally. Change?
 */
module.exports.retrieveAllPosts = function(req, res) {

  page.find({}).exec(function(err, posts) {
    jsonService.sendResponse(res, 200, posts);
  });

}

/**
 * 
 */
module.exports.retrievePostBySlug = function(req, res) {

  // go fetch wanted content via mongoose
  page.findOne({
    'url': req.params.slug
  }, function(err, page) {

    // return 200 only if page is found, otherwise return 404
    if (page) {
      jsonService.sendResponse(res, 200, page);
    } else {
      jsonService.sendResponse(res, 404);
    }
  });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.createPost = function(req, res) {

}

/**
 * 
 */
module.exports.updatePostById = function(req, res) {

}