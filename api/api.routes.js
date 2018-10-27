'use strict';

const express = require('express'),
      router = express.Router(),
      apiCtrl = require('./api.controller');

// get all posts
router.get('/get/posts', apiCtrl.retrieveAllPosts);
// get all quotes
router.get('/get/quotes', apiCtrl.retrieveAllQuotes);
// get all events
router.get('/get/events', apiCtrl.retrieveAllEvents);
// get specific post
router.get('/get/post/:slug', apiCtrl.retrievePostBySlug);
// create post
router.post('/create/post', apiCtrl.createPost);
// create quote
router.post('/create/quote', apiCtrl.createQuote);
// create event
router.post('/create/event', apiCtrl.createEvent);
// update specific post
router.put('/update/post', apiCtrl.updatePost);
// update specific quote
router.put('/update/quote', apiCtrl.updateQuote);
// update specific event
router.put('/update/event', apiCtrl.updateEvent);

module.exports = router;