
const express = require('express');
// const { body } = require('express-validator');

// const authController = require('../controllers/auth');
// const isAuth = require('../middleware/is-auth');
const historyController = require('../controllers/history');

const router = express.Router();

router.put('/put-history', historyController.putBrowserHistory);

// router.put('/user-image', gqlUserImageUpload, imageForGqlController.putUserImage);

module.exports = router;
