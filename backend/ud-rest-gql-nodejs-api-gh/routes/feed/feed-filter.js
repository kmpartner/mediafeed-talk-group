const express = require('express');
const { body } = require('express-validator');

// const feedController = require('../../controllers/feed/feed');
const feedFilterController = require('../../controllers/feed/feed-filter');
// const isAuth = require('../middleware/is-auth');
const isAuth = require('../../middleware/is-auth');
const redisCacheCheck = require('../../middleware/redis-cache-check');

const router = express.Router();


// GET /feed/posts
// router.get('/action', isAuth, feedController.feedAction);

router.get(
    '/most-visit-posts', 
    // isAuth, 
    redisCacheCheck,
    feedFilterController.getMostVisitPosts
);

router.get(
    '/most-reaction-posts', 
    redisCacheCheck,
    feedFilterController.getMostReactionPosts
);

module.exports = router;