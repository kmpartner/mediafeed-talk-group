const fs = require('fs');
const path = require('path');

const multer = require('multer');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/webm'
  ) {
    cb(null, true);
  } 
   else {
    cb(null, false);
  }
}

const multerLimits = { 
  fileSize: process.env.MULTER_SIZE_LIMIT_MB
    ? 1000 * 1000 * Number(process.env.MULTER_SIZE_LIMIT_MB) 
    : 1024 * 1024 * 5 
};

exports.imageUpload = multer({
  storage: fileStorage,
  limits: multerLimits,
  fileFilter: fileFilter
}).single('image')


const filesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + `-${Math.floor(Math.random() * 10**6).toString()}crid-` + file.originalname);
  }
});

const filesFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/webp'
    // file.mimetype === 'video/mp4' ||
    // file.mimetype === 'video/webm'
  ) {
    cb(null, true);
  } 
   else {
    cb(null, false);
  }
}


exports.imagesUpload = multer({
  storage: filesStorage,
  limits: multerLimits,
  fileFilter: filesFilter
}).array('images', 6)




//// videos upload

const multerVideoLimits = { 
  fileSize: process.env.MULTER_VIDEO_SIZE_LIMIT_MB
    ? 1000 * 1000 * Number(process.env.MULTER_VIDEO_SIZE_LIMIT_MB) 
    : 1024 * 1024 * 5
};

const fileVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images-video');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + `-${Math.floor(Math.random() * 10**6).toString()}crid-` + file.originalname);
  }
});

const videoFilter = (req, file, cb) => {
  if (
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/webm'
  ) {
    cb(null, true);
  } 
   else {
    cb(null, false);
  }
}

exports.videoUpload = multer({
  storage: fileVideoStorage,
  limits: multerVideoLimits,
  fileFilter: videoFilter,
}).array('images', 1)







const userfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images-user');
  },
  filename: (req, file, cb) => {
    // console.log('req.body, req.query', req.body, req.query);
    cb(null, req.query.userId + '-' + new Date().toISOString() + '-' + file.originalname);
  }
});

const gqlUserfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images-user');
  },
  filename: (req, file, cb) => {
    // console.log('req.body, req.query', req.body, req.query);
    cb(null, req.userId + '-' + new Date().toISOString() + '-' + file.originalname);
  }
});

const userfileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp' 
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const usermulterLimits = { fileSize: 1024 * 1024 * 1 };

exports.userImageUpload = multer({
  storage: userfileStorage,
  limits: usermulterLimits,
  fileFilter: userfileFilter
}).single('image')

exports.gqlUserImageUpload = multer({
  storage: gqlUserfileStorage,
  limits: usermulterLimits,
  fileFilter: userfileFilter
}).single('image')






const groupfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images-group');
  },
  filename: (req, file, cb) => {
    // console.log('req.body, req.query', req.body, req.query);
    cb(null, req.query.userId + '-' + new Date().toISOString() + '-' + file.originalname);
  }
});


const groupfileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp' 
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const groupmulterLimits = { fileSize: 1024 * 1024 * 1 };

exports.groupImageUpload = multer({
  storage: groupfileStorage,
  limits: groupmulterLimits,
  fileFilter: groupfileFilter
}).single('image')
