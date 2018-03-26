const express = require('express'),
      router = express.Router(),
      apiCtrl = require('./api.controller');

// get all posts
router.get('/get/posts', apiCtrl.retrieveAllPosts);
// get specific post
router.get('/get/post/:id', apiCtrl.retrievePostById);
// create post
router.post('/create/post', apiCtrl.createPost);
// update specific post
router.put('/update/post/:id', apiCtrl.updatePostById);

module.exports = router;