const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
const Comment = require('../../models/feed/comment');
const { clearImage } = require('../../util/file');
const imageModify = require('../../util/image');
const { createSmallUserImage, s3Upload, s3DeleteMany, s3DeleteOne } = require('../../util/image');

require('dotenv').config();

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();

exports.putPostImage = async (req, res, next) => {
    // console.log('post-image req.body: ', req.body);
    // console.log('post-image req.file: ', req.file);
    // console.log('post-image req.files: ', req.files);
    // console.log('req.body.oldPath', req.body.oldPath);

    if (!req.isAuth) {
      throw new Error('Not authenticated');
  }
  if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
  }



  const createSmallImages = () => {
    return new Promise( async (resolve, reject) => {

        let thumbnailImageUrl;
        let modifiedImageUrl
        if (req.file.path !== 'undefined') {
          modifiedImageUrl = imageModify.makeModifiedUrl(req.file.path);
          const forFileFileType = imageModify.makeFileTypeForThumbnail(req.file.path);
          const forFileFileName = imageModify.makeFileNameForThumbnail(req.file.path);
          console.log('modifiedImageUrl', modifiedImageUrl);
          // console.log('forfilefileType', forFileFileType);
          // console.log('forFileFileName', forFileFileName);
    
          const fileMimetype = forFileFileType;
          // console.log('forfilefiletype', forFileFileType)
    
          if (
            fileMimetype === 'jpg' ||
            fileMimetype === 'jpeg' ||
            fileMimetype === 'png' ||
            fileMimetype === 'webp'
          ) {
            // console.log('in image minetype')
            const smallImage = await imageModify.createSmallImage(req.file.path, modifiedImageUrl);
    
            // console.log('smallImage', smallImage);
            var modifyParams = {
                ACL: 'private',
                // ACL: 'public-read',
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Body: fs.createReadStream(modifiedImageUrl),
                //   ContentType: 'image/jpeg',
                Key: `${modifiedImageUrl}`
              };

            await s3Upload(modifyParams);
            clearImage(req.file.path);
            clearImage(modifiedImageUrl);

            resolve('image uploaded');

          }
          if (
            fileMimetype === 'mp4' ||
            fileMimetype === 'webm'
          ) {
            thumbnailImageUrl = 'images/' + forFileFileName;
            const trimedVideo = await imageModify.trimVideo(req.file.path, modifiedImageUrl);
            const thumbnail = await imageModify.createThumbnail(req.file.path, forFileFileName);
    
            var modifyParams2 = {
                ACL: 'private',
                // ACL: 'public-read',
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Body: fs.createReadStream(modifiedImageUrl),
                //   ContentType: 'image/jpeg',
                Key: `${modifiedImageUrl}`
              };
    
            await s3Upload(modifyParams2);
            clearImage(req.file.path);
            clearImage(modifiedImageUrl);

            var thumbParams = {
                ACL: 'private',
                // ACL: 'public-read',
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Body: fs.createReadStream(thumbnailImageUrl),
                //   ContentType: 'image/jpeg',
                Key: `${thumbnailImageUrl}`
              };

            await s3Upload(thumbParams);
            clearImage(thumbnailImageUrl);
    
            resolve('images uploaded');

          }
        }
      });
    }
    


  var params = {
    ACL: 'private',
    // ACL: 'public-read',
    Bucket: process.env.DO_SPACE_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    //   ContentType: 'image/jpeg',
    Key: `${req.file.path}`
  };

  await s3Upload(params);

  await createSmallImages();

  if (req.body.oldPath) {

    if (req.body.oldPath === 'deleted' || req.body.oldPath === 'undefined') {
        return res.status(201).json({ message: 'File Stored', filePath: req.file.path });
    }

    const modifiedImageUrl = imageModify.makeModifiedUrl(req.body.oldPath);
    const forFileFileType = imageModify.makeFileTypeForThumbnail(req.body.oldPath);
    const forFileFileName = imageModify.makeFileNameForThumbnail(req.body.oldPath);
    // console.log('modifiedImageUrl', modifiedImageUrl);
    // console.log('forfilefileType', forFileFileType);
    // console.log('forFileFileName', forFileFileName);

    let thumbnailImageUrl;
    const fileMimetype = forFileFileType;
    // console.log('forfilefiletype', forFileFileType)
    if (
      fileMimetype === 'jpg' ||
      fileMimetype === 'jpeg' ||
      fileMimetype === 'png' ||
      fileMimetype === 'webp' 
    ) {
      console.log('in image minetype')
        // clearImage(req.body.oldPath);
        // clearImage(modifiedImageUrl);

        const deleteParams = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Delete: {
                Objects: [
                    { Key: req.body.oldPath },
                    { Key: modifiedImageUrl }
                ],
                // Quiet: false
            }
        };

        await s3DeleteMany(deleteParams);

    }

    if (
      fileMimetype === 'mp4' ||
      fileMimetype === 'webm'
    ) {
        thumbnailImageUrl = 'images/' + forFileFileName;  
        // clearImage(req.body.oldPath);
        // clearImage(modifiedImageUrl);
        // clearImage(thumbnailImageUrl);

        const deleteParams2 = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Delete: {
                Objects: [
                    { Key: req.body.oldPath },
                    { Key: modifiedImageUrl },
                    { Key: thumbnailImageUrl}
                ],
                // Quiet: false
            }
        };

        await s3DeleteMany(deleteParams2);

    }

  }

  return res.status(201).json({ message: 'File Stored', filePath: req.file.path });

};


exports.putPostImages = async (req, res, next) => {

};

exports.putUserImage = async (req, res, next) => {
    // console.log('user-image req.body: ', req.body);
    // console.log('user-image req.file.path: ', req.file.path);
    // console.log('req.body.oldPath', req.body.oldPath);
    if (!req.isAuth) {
      throw new Error('Not authenticated');
  }
  if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
  }

  await imageModify.createSmallUserImage(req.file.path);

  // let imageUrl = req.file.path;


  var params = {
    ACL: 'private',
    // ACL: 'public-read',
    Bucket: process.env.DO_SPACE_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    //   ContentType: 'image/jpeg',
    Key: `${req.file.path}`
  };

  await s3Upload(params);
  clearImage(req.file.path);

  if (req.body.oldPath && req.body.oldPath !== 'null') {
      const deleteParams = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: req.body.oldPath
      };
      await s3DeleteOne(deleteParams);
      clearImage(req.body.oldPath);
  }


  return res.status(201).json({ message: 'File Stored', filePath: req.file.path });

}
