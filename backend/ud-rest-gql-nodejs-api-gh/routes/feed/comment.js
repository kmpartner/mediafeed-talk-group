const express = require('express');
const { body } = require('express-validator');

// const feedController = require('../controllers/feed');
const commentController = require('../../controllers/feed/comment');
// const isAuth = require('../middleware/is-auth');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

// GET /feed/action

router.get('/action', isAuth, commentController.commentAction);

router.get('/comments', 
    // isAuth, 
    commentController.getPostComments
);

router.get('/:commentId', 
    // isAuth, 
    commentController.getPostComment
);

router.post(
    '/', 
    isAuth,
    [
    // body('title')
    //     .trim()
    //     .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 1 })
], commentController.createPostComment);

router.delete('/:commentId', 
    isAuth, 
    commentController.deletePostComment
);

module.exports = router;