'use strict';

const express = require('express'),
      router = express.Router(),
      adminCtrl = require('./admin.controller');

// query page
router.get('/query', adminCtrl.query);
// create page
router.get('/create', adminCtrl.create);
// update page
router.get('/update', adminCtrl.update);

module.exports = router;