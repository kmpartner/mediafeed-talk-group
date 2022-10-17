"use strict";
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'talk-files');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/webm') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const multerLimits = {
    fileSize: process.env.MULTER_SIZE_LIMIT_MB
        ? 1000 * 1000 * Number(process.env.MULTER_SIZE_LIMIT_MB)
        : 1024 * 1024 * 5
};
// exports.imageUpload = multer({
//   storage: fileStorage,
//   limits: multerLimits,
//   fileFilter: fileFilter
// }).single('image')
exports.fileUpload = multer({
    storage: fileStorage,
    limits: multerLimits,
    fileFilter: fileFilter
}).single('files');
