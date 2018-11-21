'use strict';

const mongoose = require('mongoose');

/**
 * The page schema
 */
const postSchema = new mongoose.Schema({

  // Date
  date: {
    created: {
      type: Date
    },
    modified: {
      type: Date
    }
  },
  // Content fields
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
  // Image
  image: {
    url: String
  },
  // Location
  location: {
    city: String,
    country: String
  },
  // Time
  time: {
    estimate: {
      type: Number
    }
  }
});

// Compile schema to bson, telling mongo to use 'posts' collection
mongoose.model('Post', postSchema, 'posts');