const express = require('express');
const { body } = require('express-validator');

// const feedController = require('../../controllers/feed/feed');
const feedFilterRecentController = require('../../controllers/feed/feed-filter-recent');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();


// GET /feed/posts
// router.get('/action', isAuth, feedController.feedAction);

router.get(
    '/recent-most-visit-lng-posts', 
    // isAuth,
    feedFilterRecentController.getRecentMostVisitLngPosts
);


module.exports = router;