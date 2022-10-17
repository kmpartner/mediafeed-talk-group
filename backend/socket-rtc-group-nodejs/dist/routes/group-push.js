"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const groupPushController = require('../controllers/group-push');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
router.get('/get-test', 
// isAuth,
groupPushController.getTest);
router.post('/test-push', isAuth, groupPushController.pushTest);
// router.post('/push-text-to-user', isAuth, groupPushController.pushTextToUser);
// router.post('/push-text-to-users', isAuth, groupPushController.pushTextToUsers);
module.exports = router;
