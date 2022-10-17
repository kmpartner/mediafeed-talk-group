"use strict";
const express = require('express');
const router = express.Router();
const textTalkController = require('../controllers/text-talk');
router.get('/', textTalkController.getTextTalk);
router.get('/usertalks', textTalkController.getUserTextTalks);
// router.post('/', textTalkController.postTextTalk);
// router.delete('/', textTalkController.deleteTextTalk);
// router.post('/addshark', function(req, res) {
//     shark.create(req,res);
// });
module.exports = router;
