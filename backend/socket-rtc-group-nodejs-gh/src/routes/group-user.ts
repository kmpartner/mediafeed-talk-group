export {};
const express = require('express');

// const groupTalkController = require('../controllers/group-talk');
const groupUserController = require('../controllers/group-user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/user-favorite-groups', 
  isAuth,
  groupUserController.getUserFavoriteGroups
);

router.get('/users-for-group', 
  isAuth,
  groupUserController.getUsersForGroup,
);

// router.post('/', textTalkController.postTextTalk);

// router.delete('/', textTalkController.deleteTextTalk);

// router.post('/addshark', function(req, res) {
//     shark.create(req,res);
// });

module.exports = router;