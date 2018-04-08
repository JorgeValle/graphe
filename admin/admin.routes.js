'use strict';

const express = require('express'),
      router = express.Router(),
      adminCtrl = require('./admin.controller');

// back end main page
router.get('/', adminCtrl.index);
// create page
router.get('/create', adminCtrl.create);
// update page
router.get('/update', adminCtrl.update);

module.exports = router;