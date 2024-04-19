const express = require('express');
const { body } = require('express-validator');

const User = require('../../models/user/user');
const authController = require('../../controllers/user/auth');
const isAuth = require('../../middleware/is-auth');

const authForTestController = require('../../controllers/auth-for-test/auth-for-test');

const router = express.Router();

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-mail address already exists!');
                    }
                })
        })
        .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()

], 
authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', 
isAuth,
[
    body('status')
        .trim()
        .not()
        .isEmpty()
],
authController.updateUserStatus
)

router.patch('/name', 
isAuth,
[
    body('name')
        .trim()
        .not()
        .isEmpty()
        .isLength({ max: 20 })
],
authController.updateUserName
)

router.patch('/description', 
    isAuth,
    [
        body('description')
            // .trim()
            // .not()
            // .isEmpty()
            .isLength({ max: 300 })
    ],
    authController.updateUserDescription
)

router.get('/description', isAuth, authController.getUserDescription);

router.put('/email-verified', isAuth, authController.updateEmailVerified);

router.get('/userdata', isAuth, authController.getUserData);

// router.put('/image', isAuth, authController.updateImage);

router.post('/image', isAuth, authController.createUserImage);

router.delete('/image', isAuth, authController.deleteUserImage);

// router.get('/getusers', authController.getUsers);

// router.get('/getusers-for-group', authController.getUsersForGroup);

router.get('/user-imageurl', authController.getUserImageUrl);

router.post('/user-imageurl', authController.postGetUserImageUrl);

router.post('/user-imageurls', authController.postGetUserImageUrls);

router.post('/reset', authController.postReset);

router.get('/passwordreset', authController.getResetPasswordTokenUser);

router.post('/passwordreset', authController.postNewPassword);



router.put('/updateuserinfo', isAuth, authController.updateUserInfo);

router.put('/update-user-color', isAuth, authController.updateUserColor);

// router.post('/validate-auth', isAuth, authController.validateAuth);



router.post('/auth-for-test', authForTestController.loginTokenForTest);

module.exports = router;