const express = require('express'),
      router = express.Router(),
      frontCtrl = require('./front.controller');

// homepage
router.get('/', frontCtrl.homepage);
// timeline
router.get('/about', frontCtrl.about);
// blog post by url
 router.get('/blog/:pageUrl', frontCtrl.postsByUrl);
// blog
router.get('/blog', frontCtrl.queryPosts);
// thanks page
router.get('/thanks', frontCtrl.thanks);
// sitemap.xml
router.get('/sitemap.xml', frontCtrl.sitemap);

module.exports = router;