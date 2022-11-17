"use strict";
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'talk-files');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + `-${Math.floor(Math.random() * Math.pow(10, 6)).toString()}crid-` + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/webm' ||
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'audio/wav' ||
        file.mimetype === 'audio/webm' ||
        file.mimetype === 'application/pdf'
    ////....
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const multerLimits = {
    fileSize: process.env.MULTER_SIZE_LIMIT_MB
        ? Math.pow(10, 6) * Number(process.env.MULTER_SIZE_LIMIT_MB)
        : 1024 * 1024 * 5
};
exports.filesUpload = multer({
    storage: fileStorage,
}).array('files', 1);
exports.fileUpload = multer({
    storage: fileStorage,
    limits: multerLimits,
    fileFilter: fileFilter
}).single('file');
const getFileType = (mimetype) => {
    console.log(mimetype);
    if (mimetype.split('/')[0] === 'image') {
        return 'image';
    }
    if (mimetype.split('/')[0] === 'video') {
        return 'video';
    }
    if (mimetype.split('/')[0] === 'audio') {
        return 'audio';
    }
    else {
        return mimetype;
    }
};
