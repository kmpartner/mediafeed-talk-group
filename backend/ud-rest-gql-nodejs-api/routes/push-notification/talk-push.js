const express = require('express');

const isAuth = require('../../middleware/is-auth');
const talkPushController = require('../../controllers/push-notification/talk-push');

const router = express.Router();

// router.get('/', pushNotifyController.exampleGet);

router.post('/test-push', isAuth, talkPushController.pushTest);

router.post('/push-text-to-user', isAuth, talkPushController.pushTextToUser);

router.post('/push-text-to-users', isAuth, talkPushController.pushTextToUsers);

module.exports = router;