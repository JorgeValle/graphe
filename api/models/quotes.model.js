'use strict';

const mongoose = require('mongoose');

/**
 * The quote schema
 */
const quoteSchema = new mongoose.Schema({

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

// compile schema to bson, telling mongo to use 'quotes' collection
mongoose.model('Quote', quoteSchema, 'quotes');