"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
// const textTalkController = require('../controllers/text-talk');
const fileUploadController = require('../controllers/file-upload');
router.post('/', fileUploadController.fileUpload);
// router.get('/', fileUploadController.fileUpload);
module.exports = router;
