const express = require('express');
const { body } = require('express-validator');

// const feedController = require('../controllers/feed');
// const commentController = require('../controllers/comment');
const userReactionController = require('../../controllers/feed/user-reaction');

// const isAuth = require('../middleware/is-auth');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

// GET /feed/action

router.post('/create-type', userReactionController.createUserReactionType);


router.post('/post',
  // isAuth, 
  userReactionController.createPostUserReaction
);
// router.post('/post', userReactionController.createPostUserReaction);

router.delete('/post', isAuth, userReactionController.deletePostUserReaction);
// router.delete('/post', userReactionController.deletePostUserReaction);

router.post('/post-get', 
  // isAuth, 
  userReactionController.getPostUserReaction
);


router.post('/comment', 
  isAuth, 
  userReactionController.createCommentUserReaction
);
// router.post('/comment', userReactionController.createCommentUserReaction);

router.delete('/comment', isAuth, userReactionController.deleteCommentUserReaction);
// router.delete('/comment', userReactionController.deleteCommentUserReaction);

router.post('/comment-get', isAuth, userReactionController.getCommentUserReaction);

router.post('/comments-get', 
  isAuth, 
  userReactionController.getPostCommentUserReactions
);



router.post('/group-talk', isAuth, userReactionController.createGroupTalkTextUserReaction);
// router.post('/group-talk', userReactionController.createGroupTalkTextUserReaction);

router.delete('/group-talk', isAuth, userReactionController.deleteGroupTalkTextUserReaction);
// router.delete('/group-talk', userReactionController.deleteGroupTalkTextUserReaction);

router.post('/group-talk-get', isAuth, userReactionController.getGroupTalkTextUserReaction);


module.exports = router;