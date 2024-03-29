const express = require('express');
const { body } = require('express-validator');

const talkPermissionController = require('../../controllers/user/talk-permission');
const isAuth = require('../../middleware/is-auth');
const qrIsAuth = require('../../middleware/qr-is-auth');

const router = express.Router();

router.get('/', isAuth, talkPermissionController.getUserTalkPermission);

router.post('/accept', isAuth, talkPermissionController.addAcceptUserId);

router.delete('/accept', isAuth, talkPermissionController.deleteAcceptUserId);

router.post('/request', isAuth, talkPermissionController.addRequestingUserId);

router.delete('/request', isAuth, talkPermissionController.deleteRequestingUserId);

router.get('/check-user-accept', isAuth, talkPermissionController.checkUserAccept);

router.get('/token-for-qr', isAuth, talkPermissionController.getTokenForQR);

router.post('/accept-qr', qrIsAuth, talkPermissionController.addAcceptUserId);

module.exports = router;