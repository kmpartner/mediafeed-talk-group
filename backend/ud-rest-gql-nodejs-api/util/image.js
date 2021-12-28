const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const probe = require('node-ffprobe')
const gm = require('gm');
var im = require('imagemagick');
const aws = require('aws-sdk');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();

module.exports = {
    createSmallUserImage: (imageUrl) => {
        console.log(imageUrl)
        return new Promise((resolve, reject) => {
            gm(imageUrl)
                .resize(100, 100)
                // .noProfile()
                .write(imageUrl, function (err) {
                    if (err) {
                        console.log('error occured ', err);
                        reject({ message: "error occured " + err });
                    }
                    if (!err) {
                        console.log('Done making small user image!')
                        resolve({ message: "done making small image" })
                        // console.log('done');
                        // gm(modifiedImageUrl)
                        //     .identify(function (err, data) {
                        //         if (err) console.log(err);
                        //         // if (!err) console.log('DATA:',data);

                        //     });
                    }
                });
        })
    },
    createSmallImage: (imageUrl, modifiedImageUrl) => {
        console.log(imageUrl, modifiedImageUrl)
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
                        console.log('Done making small image!')
                        resolve({ message: "done making small image" })
                        // console.log('done');
                        // gm(modifiedImageUrl)
                        //     .identify(function (err, data) {
                        //         if (err) console.log(err);
                        //         // if (!err) console.log('DATA:',data);

                        //     });
                    }
                });
        })
    },
    createSmallGroupImage: (imageUrl) => {
        console.log(imageUrl)
        return new Promise((resolve, reject) => {
            gm(imageUrl)
                .resize(100, 100)
                // .noProfile()
                .write(imageUrl, function (err) {
                    if (err) {
                        console.log('error occured ', err);
                        reject({ message: "error occured " + err });
                    }
                    if (!err) {
                        console.log('Done making small group image!')
                        resolve({ message: "done making small group image" })
                        // console.log('done');
                        // gm(modifiedImageUrl)
                        //     .identify(function (err, data) {
                        //         if (err) console.log(err);
                        //         // if (!err) console.log('DATA:',data);

                        //     });
                    }
                });
        })
    },
    trimVideo: (imageUrl, modifiedImageUrl) => {
        return new Promise((resolve, reject) => {
            ffmpeg(imageUrl)
                .setFfmpegPath(ffmpeg_static)
                .setStartTime('00:00:01') //Can be in "HH:MM:SS" format also
                .setDuration(3)
                .size("50x?").autopad()
                .on("start", function (commandLine) {
                    console.log("Spawned FFmpeg with command: " + commandLine);
                })
                .on('codecData', function (data) {
                    console.log('Input is ' + data.audio_details + ' AUDIO ' +
                        'WITH ' + data.video_details + ' VIDEO');
                })
                .on("error", function (err) {
                    console.log("error: ", err);
                    reject({ message: "error occured " + err });
                })
                .on("end", function (err) {
                    if (!err) {
                        console.log("video trim conversion Done");
                        resolve({ message: 'video trim conversion Done' })
                    }
                })
                .saveToFile(modifiedImageUrl);

        })
    },
    createThumbnail: (imageUrl, filename) => {
        return new Promise((resolve, reject) => {
            ffmpeg(imageUrl)
                // setup event handlers
                // .on('filenames', function(filename) {
                //     console.log('screenshots are ' + filenames.join(', '));
                // })
                .on('end', function () {
                    console.log('screenshots were saved');
                    resolve({ message: 'screenshots were saved' })
                })
                .on('error', function (err) {
                    console.log('an error happened: ' + err.message);
                    reject({ message: "error occured " + err });
                })
                // take 2 screenshots at predefined timemarks and size
                .takeScreenshots({
                    count: 1,
                    filename: filename,
                    timemarks: ['50%'],
                    size: '?x100'
                }, './images');
        })
    },
    makeModifiedUrl: (dataUrl) => {
        const imageUrlArray = dataUrl.split('.');
        const fileType = imageUrlArray.pop();
        const withoutFileType = imageUrlArray.join('');
        const modifiedImageUrl = withoutFileType + '-modify.' + fileType.toLowerCase();
        return modifiedImageUrl;
    },
    makeFileNameForThumbnail: (dataUrl) => {
        const ForFile = dataUrl.split('/')[1];
        const ForFileArray = ForFile.split('.');
        const forFileFileType = ForFileArray.pop();
        const forFileWithoutFileType = ForFileArray.join('');
        const forFileFileName = forFileWithoutFileType + '.jpeg';
        return forFileFileName;
    },
    makeFileTypeForThumbnail: (dataUrl) => {
        const ForFile = dataUrl.split('/')[1];
        const ForFileArray = ForFile.split('.');
        const forFileFileType = ForFileArray.pop();
        return forFileFileType.toLowerCase();
    },

    s3Upload: (paramObj) => {
        return new Promise((resolve, reject) => {
            s3.upload(paramObj, (err, data) => {
                if (err) {
                    console.log('Error occured while trying to upload modify to S3 bucket', err);
                    const error = new Error('There was an error uploading image');
                    error.statusCode = 500;
                    throw error;
                }

                console.log(data);

                resolve('image uploaded');
            });
        })
    },
    s3DeleteOne: (paramObj) => {
        return new Promise((resolve, reject) => {
            s3.deleteObject(paramObj, async function (err, data) {
                if (err) {
                    console.log("There was an error deleting: ", err.message);
                    const error = new Error('There was an error deleting image');
                    error.statusCode = 500;
                    throw error;
                }
                console.log('Deleted', data);
    
                resolve('image deleted');
            });
        })
    },
    s3DeleteMany: (paramObj) => {
        return new Promise((resolve, reject) => {
            s3.deleteObjects(paramObj, async function (err, data) {
                if (err) {
                    console.log("There was an error deleting images: ", err.message);
                    const error = new Error('There was an error deleting images');
                    error.statusCode = 500;
                    throw error;
                }
                console.log('Images Deleted', data);
                resolve('images deleted');
            });
        })
    }

}



