const express = require('express');
const { body } = require('express-validator');

const userNameDataController = require('../../controllers/user-name-data/user-name-data');

const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.get('/', 
  isAuth, 
  userNameDataController.getUserNameData,
);

// router.put('/user-name', 
//   isAuth,
//   userNameDataController.updateUserName,
// );


module.exports = router;