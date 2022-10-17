"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const groupTalkController = require('../controllers/group-talk');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
router.get('/get-test', 
// isAuth,
groupTalkController.getTest);
// router.post('/', textTalkController.postTextTalk);
// router.delete('/', textTalkController.deleteTextTalk);
// router.post('/addshark', function(req, res) {
//     shark.create(req,res);
// });
module.exports = router;
