const express = require('express');

const isAuth = require('../../middleware/is-auth');
const pushSubscriptionController = require('../../controllers/push-notification/push-subscription');

const router = express.Router();

// router.get('/', pushNotifyController.exampleGet);

router.get('/subscriptions', isAuth, pushSubscriptionController.getPushSubscriptions);

router.get('/', isAuth, pushSubscriptionController.getPushSubscription);

router.put('/', isAuth, pushSubscriptionController.updatePushSubscription);

router.delete('/', isAuth, pushSubscriptionController.deletePushSubscription);

module.exports = router;