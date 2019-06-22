'use strict';

const mongoose = require('mongoose');

/**
 * The day schema, for journal
 */
const daySchema = new mongoose.Schema({

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
    body: String,
    slug: {
      type: String,
      unique: true,
      required: true
    },
    description: String,
  },
  // Location
  location: {
    city: String,
    country: String
  },
});

// Compile schema to bson, telling mongo to use 'days' collection
mongoose.model('Day', postSchema, 'days');