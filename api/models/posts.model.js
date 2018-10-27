'use strict';

const mongoose = require('mongoose');

/**
 * The page schema
 */
const postSchema = new mongoose.Schema({

  // date
  date: {
    created: {
      type: Date
    },
    modified: {
      type: Date
    }
  },
  // content
  content: {
    title: {
      type: String,
      unique: true,
      required: true
    },
    bodies: [String],
    slug: {
      type: String,
      unique: true,
      required: true
    },
    index: String,
    description: String,
    references: String
  },
  // image
  image: {
    url: String
  },
  // location
  location: {
    city: String,
    country: String
  },
  // time
  time: {
    estimate: {
      type: Number
    }
  }
});

// compile schema to bson, telling mongo to use 'posts' collection
mongoose.model('Post', postSchema, 'posts');