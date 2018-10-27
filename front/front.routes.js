'use strict';

const express = require('express'),
      router = express.Router(),
      frontCtrl = require('./front.controller');

// homepage
router.get('/', frontCtrl.homepage);
// blog post by url
 router.get('/blog/:slug', frontCtrl.postBySlug);
// blog
router.get('/blog', frontCtrl.queryPostsAndQuotes);
// timeline
router.get('/timeline', frontCtrl.queryEvents);
// thanks page
router.get('/thanks', frontCtrl.thanks);
// sitemap.xml
router.get('/sitemap.xml', frontCtrl.sitemap);
// robots.txt
router.get('/robots.txt', frontCtrl.robots);

module.exports = router;