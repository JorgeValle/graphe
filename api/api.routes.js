'use strict';

const express = require('express'),
      router = express.Router(),
      apiCtrl = require('./api.controller');

// get all posts
router.get('/get/posts', apiCtrl.retrieveAllPosts);
// get specific post
router.get('/get/post/:slug', apiCtrl.retrievePostBySlug);
// create post
router.post('/create/post', apiCtrl.createPost);
// update specific post
router.put('/update/post', apiCtrl.updatePost);

module.exports = router;