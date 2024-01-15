const express = require('express');
const { body } = require('express-validator');

// const talkPermissionController = require('../../controllers/user/talk-permission');
const talkUserController = require('../../controllers/user/talk-user');
const isAuth = require('../../middleware/is-auth');
// const qrIsAuth = require('../../middleware/qr-is-auth');

const router = express.Router();

router.get('/talk-accepted-users', 
  isAuth, 
  talkUserController.getTalkAcceptedUsers,
);

router.get('/talk-permission-users', 
  isAuth, 
  talkUserController.getTalkPermissionUsers,
);

router.get('/talk-display-users', 
  isAuth, 
  talkUserController.getTalkDisplayUsers,
);

module.exports = router;