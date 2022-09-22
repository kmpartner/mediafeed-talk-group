export {};
const express = require('express');
const router = express.Router();

// const textTalkController = require('../controllers/text-talk');
const fileUploadController = require('../controllers/file-upload');

const { fileUpload, filesUpload } = require('../middleware/multer');

router.post('/', 
// fileUpload, 
filesUpload, 
fileUploadController.fileUpload);

router.post('/delete-files', fileUploadController.deleteFiles);
// router.get('/', fileUploadController.fileUpload);

module.exports = router;