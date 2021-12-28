const express = require('express');
const { body } = require('express-validator');

// const User = require('../../models/user/user');
// const authController = require('../../controllers/user/auth');
const groupImageController = require('../../controllers/group-image/group-image');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.get('/group-images', groupImageController.getGroupImages);

router.get('/', groupImageController.getGroupImage);

router.post('/', isAuth, groupImageController.createGroupImage);

router.delete('/', isAuth, groupImageController.deleteGroupImage);


module.exports = router;