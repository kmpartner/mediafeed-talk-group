"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
// const textTalkController = require('../controllers/text-talk');
const fileUploadController = require('../controllers/file-upload');
const { fileUpload, filesUpload } = require('../middleware/multer');
const isAuth = require('../middleware/is-auth');
router.post('/', isAuth, 
// fileUpload, 
filesUpload, fileUploadController.fileUpload);
router.post('/delete-files', isAuth, fileUploadController.deleteFiles);
module.exports = router;
