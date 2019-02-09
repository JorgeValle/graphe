{

  'use strict';

  const mongoose = require('mongoose'),
        // Models
        post = mongoose.model('Post'),
        event = mongoose.model('Event'),
        quote = mongoose.model('Quote'),
        // Services
        jsonService = require('../services/json.service'),
        passwordService = require('../services/password.service'),
        // Constants
        apiPassword = passwordService.returnApiPassword();
  
  /**
   * Retrieves all posts, sorted desc by date created
   * @since 3.3.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON formatted string of blog posts
   */
  module.exports.retrieveAllPosts = (req, res) => {
  
    post.find({}).sort([['date.created', -1]]).exec((err, posts) => {
      jsonService.sendResponse(res, 200, posts);
    });
  
  }
  
  /**
   * Retrieves all quotes, sorted desc by date created
   * @since 4.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON formatted string of quotes
   */
  module.exports.retrieveAllQuotes = (req, res) => {
  
    quote.find({}).sort([['date.created', -1]]).exec((err, quotes) => {
      jsonService.sendResponse(res, 200, quotes);
    });
  
  }
  
  /**
   * Retrieves all events, sorted desc by event date
   * @since 4.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON formatted string of events
   */
  module.exports.retrieveAllEvents = (req, res) => {
  
    event.find({}).sort([['content.date', -1]]).exec((err, events) => {
      jsonService.sendResponse(res, 200, events);
    });
  
  }
  
  
  /**
   * Retrieves a single blog post, found by slug
   * @since 3.3.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON formatted content of the blog post, if found
   */
  module.exports.retrievePostBySlug = (req, res) => {
  
    // Fetch wanted content via Mongoose
    post.findOne({
      'content.slug': req.params.slug
    }, function(err, post) {
  
      // Return 200 only if found
      if (post) {
        jsonService.sendResponse(res, 200, post);
      } else {
        jsonService.sendResponse(res, 404);
      }
    });
  
  }
  
  /**
   * Creates a new blog post
   * @since 3.3.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON for the newly created blog post, if authorized
   */
  module.exports.createPost = (req, res) => {
  
    // Create a new model document with parameters
    const newPost = new post({
  
      // Date
      date: {
        created: new Date()
      },
      // Content fields
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
      // Location
      location: {
        city: req.body.city,
        country: req.body.country
      },
      // Read time
      time: {
        estimate: req.body.estimate
      }
    });
  
    // Check for auth
    if (req.body.password === apiPassword) {
  
      // Save the final document to the database
      newPost.save((err, post) => {
  
        if (err) {
          jsonService.sendResponse(res, 500, err);
        } else {
          jsonService.sendResponse(res, 201, post);
        }
      });
  
    // Not authorized
    } else {
      jsonService.sendResponse(res, 403, 'Nice try, buddy.');
    }
  
  }
  
  /**
   * Creates a new quote
   * @since 4.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON for the newly created quote, if authorized
   */
  module.exports.createQuote = (req, res) => {
  
    // Create a new model document
    const newQuote = new quote({
  
      // Date
      date: {
        created: new Date()
      },
      // Content fields
      content: {
        quote: req.body.quote,
        slug: req.body.slug,
        author: req.body.author
      }
    });
  
    // Check for auth
    if (req.body.password === apiPassword) {
  
      // Save the final document to the database
      newQuote.save((err, quote) => {
  
        if (err) {
          console.log(err);
          jsonService.sendResponse(res, 500, err);
        } else {
          jsonService.sendResponse(res, 201, quote);
        }
      });
  
    // Not authorized
    } else {
      jsonService.sendResponse(res, 403, 'Nice try, buddy.');
    }
  
  }
  
  /**
   * Creates a new event
   * @since 4.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON for the newly created event, if authorized
   */
  module.exports.createEvent = (req, res) => {
  
    // Create a new model document
    const newEvent = new event({
  
      // Date
      date: {
        created: new Date()
      },
      // Content fields
      content: {
        name: req.body.name,
        date: req.body.date,
        description: req.body.description,
        slug: req.body.slug
      }
    });
  
    // Check for auth
    if (req.body.password === apiPassword) {
  
      // Save the final document to the database
      newEvent.save((err, event) => {
  
        if (err) {
          jsonService.sendResponse(res, 500, err);
        } else {
          jsonService.sendResponse(res, 201, event);
        }
      });
  
    // Not authorized
    } else {
      jsonService.sendResponse(res, 403, 'Nice try, buddy.');
    }
  }
  
  
  /**
   * Updates the post we find, by slug
   * @since 3.3.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON for the freshly updated blog post
   */
  module.exports.updatePost = (req, res) => {
  
    // Get url to update from router middleware and set to var
    let query = {
      'content.slug': req.body.slug
    };
  
    const updatedData = {
  
      // Content fields
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
      // Location
      location: {
        city: req.body.city,
        country: req.body.country
      },
      // Read time
      time: {
        estimate: req.body.estimate
      }
    }
  
    // Updating the mod date
    updatedData['date.modified'] = new Date();
  
    // Check for auth
    if (req.body.password === apiPassword) {
  
      // Reminder: {new:true} returns updated doc, instead of old doc
      post.findOneAndUpdate(query, updatedData, {
        new: true
      }, (err, post) => {
        jsonService.sendResponse(res, 201, post);
      });
  
    // Not authorized
    } else {
      jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
    }
  }
  
  /**
   * Updates the quote
   * @since 4.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON for the freshly updated quote
   */
  module.exports.updateQuote = (req, res) => {
  
    // Get url to update from router middleware and set to var
    let query = {
      'content.slug': req.body.slug
    };
  
    const updatedData = {
  
      // Content fields
      content: {
        quote: req.body.quote,
        slug: req.body.slug,
        author: req.body.author
      },
      // Location
      location: {
        city: req.body.city,
        country: req.body.country
      }
    }
  
    // Updating the mod date
    updatedData['date.modified'] = new Date();
  
    // Check for auth
    if (req.body.password === apiPassword) {
  
      // Reminder: {new:true} returns updated doc, instead of old doc
      quote.findOneAndUpdate(query, updatedData, {
        new: true
      }, function(err, quote) {
  
        jsonService.sendResponse(res, 201, quote);
  
      });
  
    // Not authorized
    } else {
      jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
    }
  }
  
  /**
   * Updates the event
   * @since 4.0.0
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {string} - The JSON for the freshly updated event
   */
  module.exports.updateEvent = (req, res) => {
  
    // Get url to update from router middleware and set to var
    let query = {
      'content.slug': req.body.slug
    };
  
    const updatedData = {
  
      // Content field
      content: {
        name: req.body.name,
        slug: req.body.slug,
        date: req.body.date,
        description: req.body.description
      }
    }
  
    // Updating the mod date
    updatedData['date.modified'] = new Date();
  
    // Check for auth
    if (req.body.password === apiPassword) {
  
      // Reminder: {new:true} returns updated doc
      event.findOneAndUpdate(query, updatedData, {
        new: true
      }, function(err, quote) {
  
        jsonService.sendResponse(res, 201, event);
  
      });
  
    // Not authorized
    } else {
      jsonService.sendResponsee(res, 403, 'Nice try, buddy.');
    }
  }

}