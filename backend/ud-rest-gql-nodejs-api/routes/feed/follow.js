const express = require('express');
const { body } = require('express-validator');

const followController = require('../../controllers/feed/follow');
// const isAuth = require('../middleware/is-auth');
const isAuth = require('../../middleware/is-auth');
const follow = require('../../models/feed/follow');

const router = express.Router();

router.get('/followusers', isAuth, followController.getFollowingUsers);

router.get('/followuser', isAuth, followController.getFollowingUser);

router.put('/followuser', isAuth, followController.addFollowingUser);

router.delete('/followuser', isAuth, followController.deleteFollowingUser);

router.get('/followed-userlist', isAuth, followController.getFollowedUserList);


router.get('/favoriteposts', isAuth, followController.getFavoritePosts);

router.get('/favoritePost', isAuth, followController.getFavoritePost);

router.put('/favoritepost', isAuth, followController.addFavoritePost);

router.delete('/favoritepost', isAuth, followController.deleteFavoritePost);

router.get('/favoritepost-userlist', followController.getFavoritePostUserList)
// router.get('/action', isAuth, commentController.commentAction);

// router.get('/comments', 
//     // isAuth, 
//     commentController.getPostComments
// );

// router.get('/:commentId', 
//     // isAuth, 
//     commentController.getPostComment
// );

// router.post(
//     '/', 
//     isAuth,
//     [
//     // body('title')
//     //     .trim()
//     //     .isLength({ min: 5 }),
//     body('content')
//         .trim()
//         .isLength({ min: 1 })
// ], commentController.createPostComment);

// router.delete('/:commentId', 
//     isAuth, 
//     commentController.deletePostComment
// );

module.exports = router;