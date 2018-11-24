'use strict';

const express = require('express'),
      router = express.Router(),
      adminCtrl = require('./admin.controller');

// Query all content
router.get('/query', adminCtrl.queryAll);
// Create content
router.get('/create', adminCtrl.create);
// Update content
router.get('/update', adminCtrl.queryOne);

module.exports = router;