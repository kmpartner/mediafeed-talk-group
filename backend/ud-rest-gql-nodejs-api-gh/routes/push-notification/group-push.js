const express = require('express');

const isAuth = require('../../middleware/is-auth');
const groupPushController = require('../../controllers/push-notification/group-push');

const router = express.Router();

// router.get('/', pushNotifyController.exampleGet);

router.post('/test-push', isAuth, groupPushController.pushTest);

router.post('/push-text-to-user', isAuth, groupPushController.pushTextToUser);

router.post('/push-text-to-users', isAuth, groupPushController.pushTextToUsers);

module.exports = router;