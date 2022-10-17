const express = require('express');
const { body } = require('express-validator');

const feedController = require('../../controllers/feed/feed');
const feedMultiImagesController = require('../../controllers/feed/feed-multi-images');

// const isAuth = require('../middleware/is-auth');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

const titleMinLength = 1;
const contentMinLength = 1;

// GET /feed/posts
// router.get('/action', isAuth, feedController.feedAction);

// router.get(
//     '/posts', 
//     // isAuth, 
//     feedController.getPosts
// );

// POST /feed/posts
// router.post(
//     '/post', 
//     isAuth,
//     [
//     body('title')
//         .trim()
//         .isLength({ 
//             min: titleMinLength, // max: ? 
//         }),
//     body('content')
//         .trim()
//         .isLength({ 
//             min: contentMinLength, // max: ? 
//         })
//     ],
//     feedController.createPost);


    router.post(
      '/post-images', 
      isAuth,
      [
      body('title')
          .trim()
          .isLength({ 
              min: titleMinLength, // max: ? 
          }),
      body('content')
          .trim()
          .isLength({ 
              min: contentMinLength, // max: ? 
          })
      ],
      feedMultiImagesController.createMultiImagesPost);

      
// router.get(
//     '/post/:postId', 
//     // isAuth, 
//     feedController.getPost
// );

// router.put(
//     '/post/:postId', 
//     isAuth,
//     [
//     body('title')
//         .trim()
//         .isLength({ 
//             min: titleMinLength, // max: ? 
//         }),
//     body('content')
//         .trim()
//         .isLength({ 
//             min: contentMinLength, // max: ? 
//         })
// ], feedController.updatePost);

router.put(
    '/post-images/:postId', 
    isAuth,
    [
    body('title')
        .trim()
        .isLength({ 
            min: titleMinLength, // max: ? 
        }),
    body('content')
        .trim()
        .isLength({ 
            min: contentMinLength, // max: ? 
        })
], feedMultiImagesController.updateMutiImagesPost);

// router.delete('/post/:postId', isAuth, feedController.deletePost);

router.delete(
    '/post-images/:postId', 
    isAuth, 
    feedMultiImagesController.deleteMultiImagePost
);

router.put(
    '/delete-post-images/:postId', 
    isAuth, 
    feedMultiImagesController.deletePostImages
);

// router.delete('/postimage/:postId', isAuth, feedController.deletePostImage);

// router.get(
//     '/postformap/:postId', 
//     // isAuth, 
//     feedController.getPostForMap
// );

// router.get('/comment/action', isAuth, feedController.commentAction);

// router.get('/post/:postId/comment', 
//     // isAuth, 
//     feedController.getPostComments
// );

// router.get('/post/:postId/comment/:commentId', 
//     // isAuth, 
//     feedController.getPostComment
// );

// router.post(
//     '/post/:postId/comment', 
//     isAuth,
//     [
//     // body('title')
//     //     .trim()
//     //     .isLength({ min: 5 }),
//     body('content')
//         .trim()
//         .isLength({ min: 1 })
// ], feedController.createPostComment);

// router.delete('/post/:postId/comment/:commentId', 
//     isAuth, 
//     feedController.deletePostComment
// );

module.exports = router;