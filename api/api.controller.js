'use strict';

const mongoose = require('mongoose'),
      fs = require('fs'),
      // models
      post = mongoose.model('Post'),
      event = mongoose.model('Event'),
      quote = mongoose.model('Quote'),
      // services
      jsonService = require('../services/json.service'),
      passwordService = require('../services/password.service');


// setting the API password for local and production environments
let apiPassword = passwordService.returnApiPassword();

/**
 * Retrieves all posts, sorted desc by date created
 * @param {*} req
 * @param {*} res
 * @returns {string}
 * @since 3.3
 */
module.exports.retrieveAllPosts = function(req, res) {

  post.find({}).sort([['date.created', -1]]).exec(function(err, posts) {
    jsonService.sendResponse(res, 200, posts);
  });

}

/**
 * Retrieves all quotes, sorted desc by date created
 * @param {*} req
 * @param {*} res
 * @returns {string}
 * @since 4.0
 */
module.exports.retrieveAllQuotes = function(req, res) {

  quote.find({}).sort([['date.created', -1]]).exec(function(err, quotes) {
    jsonService.sendResponse(res, 200, quotes);
  });

}

/**
 * Retrieves all events, sorted desc by event date
 * @param {*} req
 * @param {*} res
 * @returns {string}
 * @since 4.0
 */
module.exports.retrieveAllEvents = function(req, res) {

  event.find({}).sort([['content.date', -1]]).exec(function(err, events) {
    jsonService.sendResponse(res, 200, events);
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

    // date
    date: {
      created: new Date()
    },
    // content
    content: {
      title: req.body.title,
      slug: req.body.slug,
      bodies:
        [
          req.body.body
        ],
      index: req.body.index,
      description: req.body.description,
      references: req.body.references
    },
    // location
    location: {
      city: req.body.city,
      country: req.body.country
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

      if (err) {
        console.log(err);
        jsonService.sendResponse(res, 500, err);
      } else {
        jsonService.sendResponse(res, 201, post);
      }
    });


  } else {

    jsonService.sendResponse(res, 403, 'Nice try, buddy.');

  }

}

/**
 * Creates a new quote
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 4.0
 */
module.exports.createQuote = function(req, res) {

  // create a new model document
  const thisQuote = new quote({

    // date
    date: {
      created: new Date()
    },
    // content
    content: {
      quote: req.body.quote,
      slug: req.body.slug,
      author: req.body.author
    }
  });


  // check for auth
  if (req.body.password === apiPassword) {

    // save the final document to the database
    thisQuote.save(function(err, quote) {

      if (err) {
        console.log(err);
        jsonService.sendResponse(res, 500, err);
      } else {
        jsonService.sendResponse(res, 201, quote);
      }
    });


  } else {

    jsonService.sendResponse(res, 403, 'Nice try, buddy.');

  }

}


/**
 * Creates a new event
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 4.0
 */
module.exports.createEvent = function(req, res) {

  // create a new model document
  const thisEvent = new event({

    // date
    date: {
      created: new Date()
    },
    // content
    content: {
      name: req.body.name,
      date: req.body.date,
      description: req.body.description,
      slug: req.body.slug
    }
  });

  console.log(req.body.password);

  // check for auth
  if (req.body.password === apiPassword) {

    // save the final document to the database
    thisEvent.save(function(err, event) {

      if (err) {
        console.log(err);
        jsonService.sendResponse(res, 500, err);
      } else {
        jsonService.sendResponse(res, 201, event);
      }
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

    // content
    content: {
      title: req.body.title,
      slug: req.body.slug,
      bodies:
        [
          req.body.body
        ],
      index: req.body.index,
      description: req.body.description,
      references: req.body.references
    },
    // location
    location: {
      city: req.body.city,
      country: req.body.country
    },
    // time
    time: {
      estimate: req.body.estimate
    }
  }

  // updating date
  updatedData['date.modified'] = new Date();

  // check for auth
  if (req.body.password === apiPassword) {

    // {new:true} returns updated doc
    post.findOneAndUpdate(query, updatedData, {
      new: true
    }, function(err, post) {

      console.log(post);
      jsonService.sendResponse(res, 201, post);

    });

  } else {
    jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
  }
}

/**
 * Updates the quote
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 4.0
 */
module.exports.updateQuote = function(req, res) {

  // get url to update from router middleware and set to var
  let query = {
    'content.slug': req.body.slug
  };

  let updatedData = {

    // content
    content: {
      quote: req.body.quote,
      slug: req.body.slug,
      author: req.body.author
    },
    // location
    location: {
      city: req.body.city,
      country: req.body.country
    }
  }

  // updating date
  updatedData['date.modified'] = new Date();

  // check for auth
  if (req.body.password === apiPassword) {

    // {new:true} returns updated doc
    quote.findOneAndUpdate(query, updatedData, {
      new: true
    }, function(err, quote) {

      console.log(quote);
      jsonService.sendResponse(res, 201, quote);

    });

  } else {
    jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
  }
}

/**
 * Updates the event
 * @param {*} req
 * @param {*} res
 * @returns
 * @since 4.0
 */
module.exports.updateEvent = function(req, res) {

  // get url to update from router middleware and set to var
  let query = {
    'content.slug': req.body.slug
  };

  let updatedData = {

    // content
    content: {
      name: req.body.name,
      slug: req.body.slug,
      date: req.body.date,
      description: req.body.description
    }
  }

  // updating date
  updatedData['date.modified'] = new Date();

  // check for auth
  if (req.body.password === apiPassword) {

    // {new:true} returns updated doc
    event.findOneAndUpdate(query, updatedData, {
      new: true
    }, function(err, quote) {

      console.log(event);
      jsonService.sendResponse(res, 201, event);

    });

  } else {
    jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
  }
}