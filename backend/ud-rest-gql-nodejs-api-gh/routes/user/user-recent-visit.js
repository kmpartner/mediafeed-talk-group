const express = require('express');
const { body } = require('express-validator');

const userRecentVisitController = require('../../controllers/user/user-recent-visit')
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.post('/add-recent-visit-group-id', isAuth, userRecentVisitController.addRecentVisitGroupId);

router.post('/add-recent-visit-talk-user-id', isAuth, userRecentVisitController.addRecentVisitTalkUserId);

module.exports = router;