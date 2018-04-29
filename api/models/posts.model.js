'use strict';

const mongoose = require('mongoose');

// const bodySchema = new mongoose.Schema({
//   body: String
// });

/**
 * The page schema
 */
const postSchema = new mongoose.Schema({

  // meta
  meta: {
    description: String
  },
  // date
  date: {
    created: {
      type: Date,
      default: Date.now
    },
    modified: {
      type: Date,
      default: Date.now
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
  },
  // location
  location: {
    city: String,
    country: String
  },
  // taxon
  taxon: {
    type: {
      type: String,
      required: true
    },
    tags: {
      type: [String]
    }
  },
  // time
  time: {
    estimate: {
      type: Number
    }
  }
});

// compile schema to bson, telling mongo to use 'pages' collection
mongoose.model('Post', postSchema, 'posts');