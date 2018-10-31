'use strict';

const express = require('express'),
      router = express.Router(),
      adminCtrl = require('./admin.controller');

// query page
router.get('/query', adminCtrl.queryAll);
// create page
router.get('/create', adminCtrl.create);
// update page
router.get('/update', adminCtrl.queryOne);

module.exports = router;