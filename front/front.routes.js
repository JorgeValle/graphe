const express = require('express'),
      router = express.Router(),
      ctrlMain = require('../controllers/main'),
      ctrlPages = require('../controllers/pages'),
      ctrlQueries = require('../controllers/queries');

// homepage
router.get('/', ctrlMain.homepage);
// timeline
router.get('/timeline', ctrlMain.timeline);
// blog post by url
router.get('/blog/:pageUrl', ctrlPages.pageByUrl);
// blog
router.get('/blog', ctrlQueries.queryAll);
// thanks page
router.get('/thanks', ctrlPages.thanks);
// sitemap.xml
router.get('/sitemap.xml', ctrlQueries.sitemap);

module.exports = router;