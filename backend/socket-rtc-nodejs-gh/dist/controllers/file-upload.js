"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
// const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();
const { s3Upload, s3DeleteMany, clearImage, createSmallImage, makeModifiedPath, resizeVideo, getVideoInfo, createThumbnail, } = require('../util/file-upload-utils');
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.body', req.body);
        console.log('req.file', req.file);
        console.log('req.files', req.files);
        // console.log('req.userId', req.userId);
        if (req.body.userId !== req.userId) {
            throw new Error('userId error');
        }
        const toUserId = req.body.toUserId;
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            // error.statusCode = 401;
            throw error;
        }
        const result = yield fetch(process.env.UDRESTAPI_URL +
            `/talk-permission/check-user-accept?toUserId=${toUserId}`, {
            method: 'GET',
            headers: {
                // Authorization: 'Bearer ' + data.token,
                Authorization: authHeader,
                'Content-Type': 'application/json'
            },
        });
        const resData = yield result.json();
        console.log(resData);
        if (!resData.data) {
            const error = new Error('not authorized!');
            // error.statusCode = 403;
            throw error;
            // return;
        }
        console.log('user-accepted');
        // throw new Error('error-error');
        const files = req.files;
        // const files = [req.file];
        const fileUrls = [];
        const miniFileUrls = [];
        const fileSizes = [];
        // const error = new Error('not authorized!');
        // // error.statusCode = 403;
        // throw error;
        // return res.status(400).json({ message: 'error-error'});
        for (const file of files) {
            // fileUrls.push(file.path);
            //   //// process different file types
            // if (file.mimetype.split('/')[0] === 'image') {
            //   await otherUpload(file);
            //   fileUrls.push(file.path);
            // }
            // if (file.mimetype.split('/')[0] === 'audio') {
            //   await audioUpload(file);
            //   fileUrls.push(file.path);
            // }
            if (file.mimetype.split('/')[0] === 'video' || file.mimetype.split('/')[0] === 'audio') {
                const videoPath = yield videoUpload(file);
                fileUrls.push(videoPath);
                fileSizes.push({
                    filePath: videoPath,
                    fileSize: file.size,
                });
            }
            // if (file.mimetype.split('/')[0] === 'audio') {
            //   const audioPath = await audioUpload(file);
            //   fileUrls.push(audioPath);
            // }
            else {
                yield otherUpload(file);
                fileUrls.push(file.path);
                fileSizes.push({
                    filePath: file.path,
                    fileSize: file.size,
                });
            }
        }
        //// return file paths for emit data
        const returnData = {
            fileUrls: fileUrls,
            fileSizes: fileSizes,
        };
        console.log('returnData', returnData);
        res.status(200).json({ message: 'file uploaded', data: returnData });
    }
    catch (err) {
        console.log(err);
        //   if (!err.statusCode) {
        //     err.statusCode = 500;
        // }
        next(err);
    }
});
const deleteFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('req.body', req.body);
        // console.log('req.userId', req.userId);
        if (req.body.text.fromUserId !== req.userId) {
            throw new Error('userId error');
        }
        // const postId = req.params.postId;
        const deleteFilePaths = req.body.deleteFilePaths;
        // const deleteMiniFilePaths: string[] = req.body.deleteMiniFilePaths;
        // let deleteModifiedImageUrls: string[] = []; 
        // let deleteThumbnailImageUrls: string[] = [];
        // if (req.body.deleteFilePaths) {
        //     // deleteFilePaths = req.body.deleteFilePaths.split(',');
        //     deleteFilePaths = req.body.deleteFilePaths;
        // }
        // if (req.body.deleteModifiedImageUrls) {
        //     deleteModifiedImageUrls = req.body.deleteModifiedImageUrls.split(',');
        // }
        // if (req.body.deleteThumbnailImageUrls) {
        //     deleteThumbnailImageUrls = req.body.deleteThumbnailImageUrls.split(',');
        // }
        console.log('deleteFilePaths in deleteFiles', deleteFilePaths);
        if (!deleteFilePaths || deleteFilePaths.length === 0) {
            const error = new Error('deleteFilePaths not found');
            // error.statusCode = 400;
            throw error;
        }
        const imageObjects = [];
        // const miniImageObjects = [];
        const modifiedImageObjects = [];
        const thumbnailImageObjects = [];
        for (const imageUrl of deleteFilePaths) {
            imageObjects.push({
                Key: imageUrl,
            });
        }
        // for (const imageUrl of deleteMiniFilePaths) { 
        //   miniImageObjects.push({
        //       Key: imageUrl,
        //   });
        // }
        // for (const imageUrl of deleteModifiedImageUrls) { 
        //     modifiedImageObjects.push({
        //         Key: imageUrl,
        //     });
        // }
        const params = {
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Delete: {
                Objects: imageObjects,
            }
        };
        // const miniParams = {
        //   Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //   Delete: {
        //       Objects: miniImageObjects,
        //       // Quiet: false
        //   }
        // };
        // const modifiedParams = {
        //     Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //     Delete: {
        //         Objects: modifiedImageObjects,
        //         // Quiet: false
        //     }
        // };
        //// delete images depend on S3 (cloud storage) usage
        if (!process.env.S3NOTUSE) {
            yield s3DeleteMany(params);
            // await s3DeleteMany(miniParams);
            // await s3DeleteMany(modifiedParams);
        }
        if (process.env.S3NOTUSE) {
            for (const filePath of deleteFilePaths) {
                clearImage(filePath);
            }
            // for (const filePath of deleteMiniFilePaths) { 
            //   clearImage(filePath);
            // }
            // for (const imageUrl of deleteModifiedImageUrls) { 
            //     clearImage(imageUrl);
            // }
        }
        // if (deleteThumbnailImageUrls.length > 0) {
        //     // for (const imageUrl of post.thumbnailImageUrls) {
        //     //     thumbnailImageObjects.push({
        //     //         Key: imageUrl,
        //     //     });
        //     // }
        //     // const thumbParam = {
        //     //     Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //     //     Delete: {
        //     //         Objects: thumbnailImageObjects,
        //     //         // Quiet: false
        //     //     }
        //     // };
        //     // //// delete images depend on S3 (cloud storage) usage
        //     // if (!process.env.S3NOTUSE) {
        //     //     await s3DeleteMany(thumbParam);
        //     // }
        //     // if (process.env.S3NOTUSE) {
        //     //     for (const imageUrl of post.thumbnailImageUrls) {
        //     //         clearImage(imageUrl);
        //     //     }
        //     // }
        // }
        res.status(200).json({ message: 'file deleted' });
    }
    catch (err) {
        // if (!err.statusCode) {
        //     err.statusCode = 500;
        // }
        next(err);
    }
});
const videoUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const videoInfo = yield getVideoInfo(file.path);
    // const stats = fs.statSync(file.path);
    // console.log('videoInfo', videoInfo, stats);
    // throw new Error('error-error');
    const videoLength = 90;
    const audioLength = 150;
    let resizedVideo;
    let thumbnailPath;
    const resizedPath = makeModifiedPath(file.path, 'resize');
    if (file.mimetype.split('/')[0] === 'audio') {
        resizedVideo = yield resizeVideo(file.path, resizedPath, audioLength, 1);
    }
    if (file.mimetype.split('/')[0] === 'video') {
        if (videoInfo.duration > videoLength) {
            let useWidth = videoInfo.width;
            if (!videoInfo.width) {
                useWidth = 480;
            }
            if (videoInfo.width >= videoInfo.height && videoInfo.width > 480) {
                useWidth = 480;
            }
            if (videoInfo.width < videoInfo.height && videoInfo.height > 480) {
                useWidth = 270;
            }
            resizedVideo = yield resizeVideo(file.path, resizedPath, videoLength, useWidth);
        }
        else {
            if (!videoInfo.width || !videoInfo.height) {
                resizedVideo = yield resizeVideo(file.path, resizedPath, videoLength, 480);
            }
            if (videoInfo.width >= videoInfo.height && videoInfo.width > 480) {
                resizedVideo = yield resizeVideo(file.path, resizedPath, videoLength, 480);
            }
            if (videoInfo.width < videoInfo.height && videoInfo.height > 480) {
                resizedVideo = yield resizeVideo(file.path, resizedPath, videoLength, 270);
            }
        }
        // //// create thumbnail for later replace
        // const fileName = file.path.split("/")[file.path.split("/").length - 1];
        // const noExtFileName = path.parse(fileName).name;
        // const ext = path.parse(fileName).ext;
        // let pathForThumbnailList = file.path.split('/');
        // pathForThumbnailList.pop();
        // const thumbnailFolderPath = pathForThumbnailList.join('/');
        // const thumbnailFileName = noExtFileName + '-thumbnail' + '.jpg';
        // thumbnailPath = thumbnailFolderPath + '/' + thumbnailFileName;   
        // await createThumbnail(file.path, thumbnailFileName, thumbnailFolderPath);
    }
    if (resizedVideo) {
        const resizedInfo = yield getVideoInfo(resizedPath);
        var rsStats = fs.statSync(resizedPath);
        var rsfileSizeInBytes = rsStats.size;
        if (rsfileSizeInBytes >= file.size) {
            clearImage(resizedPath);
            resizedVideo = null;
        }
        // console.log('resizedInfo, rsStats, file', resizedInfo, rsStats, file);
    }
    // console.log('paths', file.path, resizedPath);
    // console.log('files', file, resizedVideo);
    // throw new Error('error-error');
    var params;
    if (!resizedVideo) {
        params = {
            ACL: 'private',
            // ACL: 'public-read',
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Body: fs.createReadStream(file.path),
            //   ContentType: 'image/jpeg',
            // Key: `images/${req.file.originalname}`
            Key: `${file.path}`
        };
    }
    if (resizedVideo) {
        params = {
            ACL: 'private',
            // ACL: 'public-read',
            Bucket: process.env.DO_SPACE_BUCKET_NAME,
            Body: fs.createReadStream(resizedPath),
            //   ContentType: 'image/jpeg',
            // Key: `images/${req.file.originalname}`
            Key: `${resizedPath}`
        };
    }
    // var paramsThumbnail = {
    //   // ACL: "public-read",
    //   Bucket: process.env.DO_SPACE_BUCKET_NAME,
    //   Body: fs.createReadStream(thumbnailPath),
    //   //   ContentType: 'image/jpeg',
    //   Key: `${thumbnailPath}`,
    // };
    //// upload files 
    if (!process.env.S3NOTUSE) {
        yield s3Upload(params);
        // await s3Upload(paramsThumbnail);
        // await s3Upload(paramsModify);
        clearImage(file.path);
        // clearImage(thumbnailPath);
        if (resizedVideo) {
            clearImage(resizedPath);
        }
        // clearImage(modifiedImageUrl);
    }
    if (process.env.S3NOTUSE) {
        if (resizedVideo) {
            clearImage(file.path);
        }
    }
    if (resizedVideo) {
        return resizedPath;
    }
    else {
        return file.path;
    }
});
// const audioUpload = async (file: any) => {
//   const videoInfo = await getVideoInfo(file.path);
//   // console.log('videoInfo', videoInfo);
//   let resizedVideo;
//   const resizedPath = makeModifiedPath(file.path, 'resize');
//   resizedVideo = await resizeVideo(file.path, resizedPath, 120, 270);
//   if (resizedVideo) {
//     const resizedInfo = await getVideoInfo(resizedPath);
//     var rsStats = fs.statSync(resizedPath);
//     var rsfileSizeInBytes = rsStats.size;
//     if (rsfileSizeInBytes >= file.size) {
//       clearImage(resizedPath);
//       resizedVideo = null;
//     }
//     // console.log('resizedInfo, rsStats, file', resizedInfo, rsStats, file);
//   }
//   // throw new Error('error-error');
//   var params = {
//     ACL: 'private',
//     // ACL: 'public-read',
//     Bucket: process.env.DO_SPACE_BUCKET_NAME,
//     Body: fs.createReadStream(file.path),
//     //   ContentType: 'image/jpeg',
//     // Key: `images/${req.file.originalname}`
//     Key: `${file.path}`
//   };
//   if (resizedVideo) {
//     params = {
//       ACL: 'private',
//       // ACL: 'public-read',
//       Bucket: process.env.DO_SPACE_BUCKET_NAME,
//       Body: fs.createReadStream(resizedPath),
//       //   ContentType: 'image/jpeg',
//       // Key: `images/${req.file.originalname}`
//       Key: `${resizedPath}`
//     };
//   }
//   //// upload files 
//   if (!process.env.S3NOTUSE) {
//     await s3Upload(params);
//     // await s3Upload(paramsModify);
//     clearImage(file.path);
//     if (resizedVideo) {
//       clearImage(resizedPath);
//     }
//         // clearImage(modifiedImageUrl);
//   }
//   if (process.env.S3NOTUSE) {
//     if (resizedVideo) {
//       clearImage(file.path);
//     }
//   }
//   if (resizedVideo) {
//     return resizedPath;
//   } else {
//     return file.path;
//   }
// };
const otherUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var params = {
        ACL: 'private',
        // ACL: 'public-read',
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Body: fs.createReadStream(file.path),
        //   ContentType: 'image/jpeg',
        // Key: `images/${req.file.originalname}`
        Key: `${file.path}`
    };
    //// upload files 
    if (!process.env.S3NOTUSE) {
        yield s3Upload(params);
        // await s3Upload(paramsModify);
        clearImage(file.path);
        // clearImage(modifiedImageUrl);
    }
});
// const imageUpload = async (file: any) => {
//   try {
//     const modifiedFilePath = makeModifiedPath(file.path, 'mini');
//     const smallImage = await createSmallImage(file.path, modifiedFilePath);
//     var params = {
//         ACL: 'private',
//         // ACL: 'public-read',
//         Bucket: process.env.DO_SPACE_BUCKET_NAME,
//         Body: fs.createReadStream(file.path),
//         //   ContentType: 'image/jpeg',
//         // Key: `images/${req.file.originalname}`
//         Key: `${file.path}`
//     };
//     var paramsModify = {
//       ACL: 'private',
//       // ACL: 'public-read',
//       Bucket: process.env.DO_SPACE_BUCKET_NAME,
//       Body: fs.createReadStream(modifiedFilePath),
//       //   ContentType: 'image/jpeg',
//       // Key: `images/${req.file.originalname}`
//       Key: `${modifiedFilePath}`
//   };
//     //// upload files 
//     if (!process.env.S3NOTUSE) {
//       await s3Upload(params);
//       await s3Upload(paramsModify);
//       clearImage(file.path);
//       clearImage(modifiedFilePath);
//     }
//     return {
//       filePath: file.path,
//       miniFilePath: modifiedFilePath,
//     }
//   } 
//   catch(err) {
//     console.log(err);
//     throw err;
//   }
// };
// const audioUpload = async (file: any) => {
//   var params = {
//       ACL: 'private',
//       // ACL: 'public-read',
//       Bucket: process.env.DO_SPACE_BUCKET_NAME,
//       Body: fs.createReadStream(file.path),
//       //   ContentType: 'image/jpeg',
//       // Key: `images/${req.file.originalname}`
//       Key: `${file.path}`
//   };
//   //// upload files 
//   if (!process.env.S3NOTUSE) {
//     await s3Upload(params);
//     // await s3Upload(paramsModify);
//     clearImage(file.path);
//         // clearImage(modifiedImageUrl);
//   }
// };
// const deleteFile = async (req: any, res: any, next: any) => {
//   console.log('req.query', req.query)
//   const filePath = req.query;
//   const files = req.files;
//   const fileUrls = [];
//   for (const file of files) {
//       //// process different file types
//       fileUrls.push(file.path);
//       var params = {
//         ACL: 'private',
//         // ACL: 'public-read',
//         Bucket: process.env.DO_SPACE_BUCKET_NAME,
//         Body: fs.createReadStream(file.path),
//         //   ContentType: 'image/jpeg',
//         // Key: `images/${req.file.originalname}`
//         Key: `${file.path}`
//     };
//     //// upload files 
//     if (!process.env.S3NOTUSE) {
//       await s3Upload(params);
//       // await s3Upload(paramsModify);
//       clearImage(file.path);
//           // clearImage(modifiedImageUrl);
//     }
//   }
//   //// return file paths for emit data
//   const returnData = {
//     fileUrls: fileUrls,
//   }
//   res.status(200).json({ message: 'file uploaded', data: returnData });
// };
module.exports = {
    fileUpload,
    deleteFiles,
};
