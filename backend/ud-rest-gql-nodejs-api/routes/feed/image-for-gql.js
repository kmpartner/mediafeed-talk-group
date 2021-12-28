const express = require('express');
// const { body } = require('express-validator');

// const User = require('../models/user');
// const authController = require('../controllers/auth');
// const isAuth = require('../middleware/is-auth');
const imageForGqlController = require('../../controllers/feed/image-for-gql');
const { 
  imageUpload, 
  gqlUserImageUpload, 
  // imagesUpload 
} = require('../../middleware/multer');
// const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.put('/post-image', imageUpload, imageForGqlController.putPostImage);

// router.put('/post-images', isAuth, imagesUpload, imageForGqlController.putPostImages);

router.put('/user-image', gqlUserImageUpload, imageForGqlController.putUserImage);

module.exports = router;