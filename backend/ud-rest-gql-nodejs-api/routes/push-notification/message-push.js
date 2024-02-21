const express = require('express');

const isAuth = require('../../middleware/is-auth');
const messagePushController = require('../../controllers/push-notification/message-push');

const router = express.Router();

// router.get('/', pushNotifyController.exampleGet);

// router.post('/test-push', isAuth, messagePushController.pushTest2);

// router.post('/xxxxx', messagePushController.pushTest3)
module.exports = router;