const express = require('express');

const adController = require('../../controllers/ad/ad');

const router = express.Router();

router.get('/test-get', adController.getTest);

router.get('/near-adelements', adController.getNearAdElements);

router.post('/ad-display', adController.storeAdDisplay);

router.post('/ad-visit', adController.storeClickVisit);

router.post('/ad-video-view-visit', adController.storeAdVideoViewVisit);

module.exports = router;