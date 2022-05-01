const express = require('express');

const adController = require('../../controllers/ad/ad');

const router = express.Router();

router.get('/test-get', adController.getTest);

router.post('/store-ad-display', adController.storeAdDisplay);

module.exports = router;