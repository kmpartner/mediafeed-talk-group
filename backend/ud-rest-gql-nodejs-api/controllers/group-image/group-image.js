const fs = require('fs');
const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

require('dotenv').config()

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
const Comment = require('../../models/feed/comment');
const GroupImage = require('../../models/group-image/group-image');
const { clearImage } = require('../../util/file');
const { createSmallGroupImage, s3Upload, s3DeleteOne } = require('../../util/image');
 
const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();


exports.getGroupImages = async (req, res, next) => {
    // console.log('req.body, req.file', req.body, req.file);
    // console.log('req.file.path', req.file.path, 'req.userId', req.userId);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data incorrect.');
            error.statusCode = 422;
            throw error;
        }

    
        const groupImages = await GroupImage.find({});

        const returnList = [];

        for (const image of groupImages) {
            // console.log('image', image);
            let returnImageUrl;

            const port = process.env.PORT || 8083;
            
            if (!process.env.S3NOTUSE) {
                returnImageUrl = s3.getSignedUrl('getObject', {
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Key: image.imageUrl ? image.imageUrl : 'dummy-key',
                    Expires: 60 * 60 * 24 * 365
                }); 
            }

            if (process.env.S3NOTUSE) {
                returnImageUrl = `http://localhost:${port}/${image.imageUrl}`;
            }
            // console.log('returnImageUrl', returnImageUrl);

            if (image.imageUrl) {
                returnList.push({
                    groupRoomId: image.groupRoomId,
                    imagePath: image.imagePath,
                    // imageUrl: image.imageUrl 
                    //     ? s3.getSignedUrl('getObject', {
                    //         Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    //         Key: image.imageUrl ? image.imageUrl : 'dummy-key',
                    //         Expires: 60 * 60 * 24 * 365
                    //     }) 
                    //     : null,
                    imageUrl: returnImageUrl,
                })
            }
        }

        // const groupImageUrlsData = groupImages.map(image => {
        //     if (image.imageUrl) {
        //         return {
        //             groupRoomId: image.groupRoomId,
        //             imagePath: image.imagePath,
        //             imageUrl: image.imageUrl 
        //                 ? s3.getSignedUrl('getObject', {
        //                     Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //                     Key: image.imageUrl ? image.imageUrl : 'dummy-key',
        //                     Expires: 60 * 60 * 24 * 365
        //                 }) 
        //                 : null,
        //         }
        //     } else {
        //         return;
        //     }
        // });

        res.status(200).json({ message: 'group images get success', data: returnList });
        
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getGroupImage = async (req, res, next) => {
    // console.log('req.body, req.file', req.body, req.file);
    // console.log('req.file.path', req.file.path, 'req.userId', req.userId);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const groupRoomId = req.query.groupRoomId;

    
        const groupImage = await GroupImage.findOne({ groupRoomId: groupRoomId });
        
        if (!groupImage) {
            const error = new Error('group image not found');
            error.statusCode = 404;
            throw error;
        }

        let returnImageUrl;

        const port = process.env.PORT || 8083;
        
        if (!process.env.S3NOTUSE) {
            returnImageUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: groupImage.imageUrl ? groupImage.imageUrl : 'dummy-key',
                Expires: 60 * 60 * 24 * 365
            });
        }

        if (process.env.S3NOTUSE) { 
            returnImageUrl = `http://localhost:${port}/${groupImage.imageUrl}`;
        }

        const imageUrlData = {
            groupRoomId: groupImage.groupRoomId,
            imagePath: groupImage.imagePath,
            // imageUrl: groupImage.imageUrl 
            //     ? s3.getSignedUrl('getObject', {
            //         Bucket: process.env.DO_SPACE_BUCKET_NAME,
            //         Key: groupImage.imageUrl ? groupImage.imageUrl : 'dummy-key',
            //         Expires: 60 * 60 * 24 * 365
            //     }) 
            //     : null,
            imageUrl: returnImageUrl,
        };

        res.status(200).json({ message: 'group image get success', data: imageUrlData });
        
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createGroupImage = async (req, res, next) => {
    // console.log('req.body, req.file', req.body, req.file);
    // console.log('req.file.path', req.file.path, 'req.userId', req.userId);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data incorrect.');
            error.statusCode = 422;
            throw error;
        }
        if (!req.file) {
            // res.status(422).json({ message: 'file is unacceptable file type or not exits'});
            const error = new Error('No image provided');
            error.statusCode = 422;
            throw error;
        }

        // const imageCreator = await User.findById(req.userId);
        // const imageCreator = await User.findOne({ userId: req.userId });
        const groupRoomId = req.query.groupRoomId;
        const imageUrl = req.file.path;
        const location = JSON.parse(req.query.userLocation);
        let imageCreator = await GroupImage.findOne({ groupRoomId: groupRoomId });
        // console.log('Location', location);


    
        if (!imageCreator) {
          imageCreator = new GroupImage({
            groupRoomId: groupRoomId,
            imageUrl: imageUrl,
            imagePath: imageUrl,
          });
          await imageCreator.save();

          await createSmallGroupImage(imageUrl);

          if (!process.env.S3NOTUSE) {

              var params = {
                  ACL: 'private',
                  // ACL: 'public-read',
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Body: fs.createReadStream(imageUrl),
                  //   ContentType: 'image/jpeg',
                  // Key: `images/${req.file.originalname}`
                  Key: `${imageUrl}`
              };
    
              await s3Upload(params);
              clearImage(req.file.path);
          }

        }
        else {
          await createSmallGroupImage(imageUrl);

          if (!process.env.S3NOTUSE) {

              var params = {
                  ACL: 'private',
                  // ACL: 'public-read',
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Body: fs.createReadStream(imageUrl),
                  //   ContentType: 'image/jpeg',
                  // Key: `images/${req.file.originalname}`
                  Key: `${imageUrl}`
              };
    
              await s3Upload(params);
              clearImage(req.file.path);
              // fs.unlinkSync(req.file.path);
    
              if (imageCreator.imageUrl) {
                  const deleteParams = {
                      Bucket: process.env.DO_SPACE_BUCKET_NAME,
                      Key: imageCreator.imageUrl
                  }
                  await s3DeleteOne(deleteParams);
                  clearImage(imageCreator.imageUrl);
              }
          }

          if (process.env.S3NOTUSE) {
            if (imageCreator.imageUrl) {
                clearImage(imageCreator.imageUrl);
            }
          }


          imageCreator.imageUrl = imageUrl;
          imageCreator.imagePath = imageUrl;
          imageCreator.geolocation = location;
          await imageCreator.save();
        }


        let returnImageUrl; 

        const port = process.env.PORT || 8083;

        if (!process.env.S3NOTUSE) {
            returnImageUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: imageCreator.imageUrl ? imageCreator.imageUrl : 'dummy-key',
                Expires: 60 * 60 * 24 * 365
            });
        }

        if (process.env.S3NOTUSE) {
            returnImageUrl = `http://localhost:${port}/${imageCreator.imageUrl}`;
        }

        const returnData = {
            groupRoomId: imageCreator.groupRoomId,
            imagePath: imageCreator.imagePath,
            // imageUrl: imageCreator.imageUrl 
            // ? s3.getSignedUrl('getObject', {
            //     Bucket: process.env.DO_SPACE_BUCKET_NAME,
            //     Key: imageCreator.imageUrl ? imageCreator.imageUrl : 'dummy-key',
            //     Expires: 60 * 60 * 24 * 365
            // }) 
            // : null,
            imageUrl: returnImageUrl,
        }

        // res.status(200).json({ message: 'image updated', data: { imageUrl: imageUrl } });
        res.status(200).json({ message: 'image updated', data: returnData });


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.updateImage = async (req, res, next) => {
// }

exports.deleteGroupImage = async (req, res, next) => {
    try {
        console.log('req.query', req.query);
        const location = JSON.parse(req.query.userLocation);
        // console.log('Location', location);

        // const user = await User.findById(req.userId);
        // const user = await User.findOne({ userId: req.userId });
        const user = await GroupImage.findOne({ groupRoomId: req.query.groupRoomId });
        
        if (!user) {
            const error = new Error('Could not find group image.');
            error.statusCode = 404;
            throw error;
        }
        // if (user._id.toString() !== req.userId) {
        //     const error = new Error('not authorized!');
        //     error.statusCode = 403;
        //     throw error;
        // }

        // clearImage(user.imageUrl);

        if (!process.env.S3NOTUSE) {
            const deleteParams = {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: user.imageUrl
            }
            await s3DeleteOne(deleteParams);
            clearImage(user.imageUrl);
        }

        if (process.env.S3NOTUSE) {
            clearImage(user.imageUrl);
        }

        // const deleteParams = {
        //     Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //     Key: user.imageUrl
        // }
        // await s3DeleteOne(deleteParams);
        // clearImage(user.imageUrl);

        
        user.imageUrl = null;
        user.imagePath = null;
        user.geolocation = location;
        await user.save();

        res.status(200).json({ message: 'group image deleted.', data: user });


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
