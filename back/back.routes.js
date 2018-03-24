const express = require('express'),
      router = express.Router(),
      ctrlMain = require('../controllers/main');

// back end main page
router.get('/', ctrlMain.index);
// create page
router.get('/create', ctrlMain.create);
// update page
router.get('/update', ctrlMain.update);

module.exports = router;