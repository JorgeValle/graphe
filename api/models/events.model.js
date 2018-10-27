'use strict';

const mongoose = require('mongoose');

/**
 * The event schema
 */
const eventSchema = new mongoose.Schema({

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

// compile schema to bson, telling mongo to use 'events' collection
mongoose.model('Event', eventSchema, 'events');