const mongoose = require('mongoose');

let bodySchema = new mongoose.Schema({
  body: String
});

let pageSchema = new mongoose.Schema({
  meta: {
    created: Date,
    published: Date,
    modified: Date
  },
  slug: {
    type: String,
    unique: true
  },
  title: String,
  bodies: [bodySchema]
});

// compile schema to bson, telling mongo to use 'pages' collection
mongoose.model('Page', pageSchema, 'pages');