'use strict';

const mongoose = require('mongoose');

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
    index: {
      type: String
    }
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