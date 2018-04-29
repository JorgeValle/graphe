'use strict';

const mongoose = require('mongoose'),
      fs = require('fs'),
      // models
      post = mongoose.model('Post'),
      // services
      jsonService = require('../services/json.service'),
      passwordService = require('../services/password.service');


// setting the API password for local and production environments
let apiPassword = passwordService.returnApiPassword();

/**
 * Retrieves all posts, sorted desc by date
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 3.3
 * @todo This is fetching the 'pages' collection, which should have been more appropriately named 'posts' originally. Change?
 */
module.exports.retrieveAllPosts = function(req, res) {

  post.find({}).sort([['date.created', -1]]).exec(function(err, posts) {
    jsonService.sendResponse(res, 200, posts);
  });

}

/**
 * Retrieves a post
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 3.3
 */
module.exports.retrievePostBySlug = function(req, res) {

  // go fetch wanted content via mongoose
  post.findOne({
    'content.slug': req.params.slug
  }, function(err, post) {

    // return only if found
    if (post) {
      jsonService.sendResponse(res, 200, post);
    } else {
      jsonService.sendResponse(res, 404);
    }
  });

}

/**
 * Creates a new post
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 3.3
 */
module.exports.createPost = function(req, res) {

  // create a new model document
  const thisPost = new post({

    // meta
    meta: {
      description: req.body.description
    },
    // content
    content: {
      title: req.body.title,
      slug: req.body.slug,
      bodies:
        [
          req.body.contentOne,
          req.body.contentTwo,
          req.body.contentThree
        ]
    },
    // location
    location: {
      city: req.body.city,
      country: req.body.country
    },
    // taxon
    taxon: {
      type: req.body.type,
      tags: req.body.tags
    },
    // time
    time: {
      estimate: req.body.estimate
    }
  });


  // check for auth
  if (req.body.password === apiPassword) {

    // save the final document to the database
    thisPost.save(function(err, post) {
      jsonService.sendResponse(res, 201, post);
    });

  } else {

    jsonService.sendResponse(res, 403, 'Nice try, buddy.');

  }

}

/**
 * Updates the post
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 3.3
 */
module.exports.updatePost = function(req, res) {

  // get url to update from router middleware and set to var
  let query = {
    'content.slug': req.body.slug
  };

  let updatedData = {

    // meta
    meta: {
      description: req.body.description
    },
    // date
    date: {
      modified: Date.now(),
    },
    // content
    content: {
      title: req.body.title,
      slug: req.body.slug,
      bodies:
        [
          req.body.contentOne,
          req.body.contentTwo,
          req.body.contentThree
        ]
    },
    // location
    location: {
      city: req.body.city,
      country: req.body.country
    },
    // taxon
    taxon: {
      type: req.body.type,
      tags: req.body.tags
    },
    // time
    time: {
      estimate: req.body.estimate
    }
  }

  // check for auth
  if (req.body.password === apiPassword) {

    // {new:true} returns updated doc
    post.findOneAndUpdate(query, updatedData, {
      new: true
    }, function(err, post) {

      jsonService.sendResponse(res, 201, post);

    });

  } else {
    jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
  }
}