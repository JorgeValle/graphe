'use strict';

const mongoose = require('mongoose');

/**
 * The event schema
 */
const eventSchema = new mongoose.Schema({

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
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String
    },
    slug: {
      type: String,
      unique: true,
      required: true
    },
  }
});

// Compile schema down to bson, telling mongo to use 'events' collection
mongoose.model('Event', eventSchema, 'events');