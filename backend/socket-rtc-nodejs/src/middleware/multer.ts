const fs = require('fs');
const path = require('path');

const multer = require('multer');


const fileStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'talk-files');
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, new Date().toISOString() + `-${Math.floor(Math.random() * 10**6).toString()}crid-` + file.originalname);
  }
});


const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/webm' ||
    file.mimetype === 'audio/mpeg' ||
    file.mimetype === 'audio/wav' ||
    file.mimetype === 'audio/webm'
    ////....
  ) {
    cb(null, true);
  } 
   else {
    cb(null, false);
  }
}

const multerLimits = { 
  fileSize: process.env.MULTER_SIZE_LIMIT_MB
    ? 10**6 * Number(process.env.MULTER_SIZE_LIMIT_MB) 
    : 1024 * 1024 * 5 
};


exports.filesUpload = multer({
  storage: fileStorage,
  limits: multerLimits,
  fileFilter: fileFilter
}).array('files', 1)

exports.fileUpload = multer({
  storage: fileStorage,
  limits: multerLimits,
  fileFilter: fileFilter
}).single('file')


const getFileType = (mimetype: string) => {
  console.log(mimetype);
  if (mimetype.split('/')[0] === 'image') {
    return 'image'
  }

  if (mimetype.split('/')[0] === 'video') {
    return 'video'
  }

  if (mimetype.split('/')[0] === 'audio') {
    return 'audio'
  }

  else {
    return mimetype;
  }
}