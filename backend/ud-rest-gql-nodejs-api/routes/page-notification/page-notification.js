const express = require('express');

const pageNotificationController = require('../../controllers/page-notification/page-notification');
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

router.get('/', 
  isAuth, 
  pageNotificationController.getPageNotification
);

router.put('/update-last-open-time', 
  isAuth, 
  pageNotificationController.updatePageNotificationLastOpenTime
);

router.put('/update-read-state', 
  isAuth, 
  pageNotificationController.updatePageNotificationReadState,
);

module.exports = router;