const express = require('express');

const isAuth = require('../../middleware/is-auth');
const commentPushController = require('../../controllers/push-notification/comment-push');

const router = express.Router();

// router.get('/', pushNotifyController.exampleGet);

router.post('/comment-push', commentPushController.commentPush);

// router.post('/xxxxx', messagePushController.pushTest3)
module.exports = router;