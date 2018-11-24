'use strict';

const express = require('express'),
      router = express.Router(),
      frontCtrl = require('./front.controller');

// Homepage
router.get('/', frontCtrl.homepage);
// Blog post by url
 router.get('/blog/:slug', frontCtrl.postBySlug);
// Blog
router.get('/blog', frontCtrl.queryPostsAndQuotes);
// Timeline
router.get('/timeline', frontCtrl.queryEvents);
// Thanks page
router.get('/thanks', frontCtrl.thanks);
// Sitemap.xml
router.get('/sitemap.xml', frontCtrl.sitemap);
// Robots.txt
router.get('/robots.txt', frontCtrl.robots);

module.exports = router;