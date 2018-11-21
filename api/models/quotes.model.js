'use strict';

const mongoose = require('mongoose');

/**
 * The quote schema
 */
const quoteSchema = new mongoose.Schema({

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
    quote: {
      type: String,
      unique: true,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      required: true
    },
  }
});

// Compile schema down to bson, telling mongo to use 'quotes' collection
mongoose.model('Quote', quoteSchema, 'quotes');