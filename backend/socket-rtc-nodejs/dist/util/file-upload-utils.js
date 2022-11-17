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
const path = require('path');
const aws = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const gm = require('gm');
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
const s3Upload = (paramObj) => {
    return new Promise((resolve, reject) => {
        s3.upload(paramObj, (err, data) => {
            if (err) {
                console.log('Error occured while trying to upload modify to S3 bucket', err);
                const error = new Error('There was an error uploading image');
                // error.statusCode = 500;
                reject(error);
                // throw error;
            }
            console.log(data);
            resolve('image uploaded');
        });
    });
};
// s3DeleteOne: (paramObj) => {
//   return new Promise((resolve, reject) => {
//       s3.deleteObject(paramObj, async function (err, data) {
//           if (err) {
//               console.log("There was an error deleting: ", err.message);
//               const error = new Error('There was an error deleting image');
//               error.statusCode = 500;
//               throw error;
//           }
//           console.log('Deleted', data);
//           resolve('image deleted');
//       });
//   })
// },
const s3DeleteMany = (paramObj) => {
    return new Promise((resolve, reject) => {
        s3.deleteObjects(paramObj, function (err, data) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log("There was an error deleting images: ", err.message);
                    const error = new Error('There was an error deleting images');
                    // error.statusCode = 500;
                    reject(error);
                    // throw error;
                }
                console.log('Images Deleted', data);
                resolve('images deleted');
            });
        });
    });
};
const clearImage = (filePath) => {
    // filePath = path.join(__dirname, '..', filePath);
    // console.log('filePath', filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
const acceptImageExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const acceptVideoExt = ['.mp4', '.webm'];
const acceptAudioExt = ['.mp3', '.wav', '.weba'];
const isAudioFile = (fileName) => {
    // const fileNameArray = fileName.split('.');
    const ext = path.parse(fileName).ext;
    // console.log('fileName, ext', fileName, ext);
    let matchType;
    if (ext) {
        matchType = acceptAudioExt.find(type => type === ext.toLowerCase());
    }
    // console.log(matchType);
    if (matchType) {
        return true;
    }
    else {
        return false;
    }
};
const createSmallImage = (imageUrl, modifiedImageUrl) => {
    console.log(imageUrl, modifiedImageUrl);
    return new Promise((resolve, reject) => {
        gm(imageUrl)
            .resize(100, 100)
            // .noProfile()
            .write(modifiedImageUrl, function (err) {
            if (err) {
                console.log('error occured ', err);
                reject({ message: "error occured " + err });
            }
            if (!err) {
                console.log('Done making small image!');
                resolve({ message: "done making small image" });
            }
        });
    });
};
const resizeVideo = (imageUrl, modifiedImageUrl, duration, width) => {
    return new Promise((resolve, reject) => {
        ffmpeg(imageUrl)
            .setFfmpegPath(ffmpeg_static)
            // .setStartTime('00:00:01') //Can be in "HH:MM:SS" format also
            .setDuration(duration)
            // .size("50x?").autopad()
            .size(`${width}x?`).autopad()
            .on("start", function (commandLine) {
            console.log("Spawned FFmpeg with command: " + commandLine);
        })
            .on('codecData', function (data) {
            console.log('Input is ' + data.audio_details + ' AUDIO ' +
                'WITH ' + data.video_details + ' VIDEO');
        })
            .on('progress', function (progress) {
            if (progress.percent > 25 && progress.percent < 29) {
                console.log('Processing: ' + progress.percent + '% done');
            }
            if (progress.percent > 50 && progress.percent < 54) {
                console.log('Processing: ' + progress.percent + '% done');
            }
            if (progress.percent > 75 && progress.percent < 79) {
                console.log('Processing: ' + progress.percent + '% done');
            }
        })
            .on("error", function (err) {
            console.log("error: ", err);
            reject({ message: "error occured " + err });
        })
            .on("end", function (err) {
            if (!err) {
                console.log("video trim conversion Done");
                resolve({ message: 'video trim conversion Done' });
            }
        })
            .saveToFile(modifiedImageUrl);
    });
};
const getVideoInfo = (imageUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(imageUrl, (error, videoInfo) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            // console.log('videoInfo', videoInfo.streams[0]);
            resolve(videoInfo.streams[0]);
        });
    });
};
const makeModifiedPath = (dataUrl, addText) => {
    const imageUrlArray = dataUrl.split('.');
    const fileType = imageUrlArray.pop();
    const withoutFileType = imageUrlArray.join('');
    let modifiedPath;
    if (fileType) {
        modifiedPath = withoutFileType + `-${addText}.` + fileType.toLowerCase();
    }
    return modifiedPath;
};
const createReturnPost = (post) => {
    const port = process.env.PORT || 4001;
    const fileUrls = [];
    if (post.fileUrls && post.fileUrls.length > 0) {
        if (!process.env.S3NOTUSE) {
            for (const fileUrl of post.fileUrls) {
                fileUrls.push(s3.getSignedUrl("getObject", {
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Key: fileUrl,
                    Expires: 60 * 60 * 24 * 365,
                }));
            }
        }
        if (process.env.S3NOTUSE) {
            for (const fileUrl of post.fileUrls) {
                // fileUrls.push(`http://localhost:${port}/${fileUrl}`);
                fileUrls.push(fileUrl);
            }
        }
    }
    return Object.assign(Object.assign({}, post._doc), { fileUrls: fileUrls });
};
module.exports = {
    s3Upload,
    s3DeleteMany,
    clearImage,
    isAudioFile,
    createSmallImage,
    resizeVideo,
    getVideoInfo,
    makeModifiedPath,
    createReturnPost,
};
