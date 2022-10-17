
export {}
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

const s3Upload = (paramObj: any) => {
  return new Promise((resolve, reject) => {
      s3.upload(paramObj, (err: any, data: any) => {
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
  })
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

const s3DeleteMany = (paramObj: any) => {
  return new Promise((resolve, reject) => {
      s3.deleteObjects(paramObj, async function (err: any, data: any) {
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
  })
};


const clearImage = (filePath :string) => {
  // filePath = path.join(__dirname, '..', filePath);
  // console.log('filePath', filePath);
  fs.unlink(filePath, (err: any) => console.log(err));
}


const acceptImageExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const acceptVideoExt = ['.mp4', '.webm'];
const acceptAudioExt = ['.mp3', '.wav', '.weba'];

const isAudioFile = (fileName: string) => {
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
  } else {
    return false;
  }
};

const createSmallImage = (imageUrl: string, modifiedImageUrl: string) => {
  console.log(imageUrl, modifiedImageUrl)
  return new Promise((resolve, reject) => {
      gm(imageUrl)
          .resize(100, 100)
          // .noProfile()
          .write(modifiedImageUrl, function (err: any) {
              if (err) {
                  console.log('error occured ', err);
                  reject({ message: "error occured " + err });
              }
              if (!err) {
                  console.log('Done making small image!')
                  resolve({ message: "done making small image" })
              }
          });
  })
};


const resizeVideo = (imageUrl: string, modifiedImageUrl: string, duration: number, width: number) => {
  return new Promise((resolve, reject) => {
      ffmpeg(imageUrl)
          .setFfmpegPath(ffmpeg_static)
          // .setStartTime('00:00:01') //Can be in "HH:MM:SS" format also
          .setDuration(duration)
          // .size("50x?").autopad()
          .size(`${width}x?`).autopad()
          .on("start", function (commandLine: any) {
              console.log("Spawned FFmpeg with command: " + commandLine);
          })
          .on('codecData', function (data: any) {
              console.log('Input is ' + data.audio_details + ' AUDIO ' +
                  'WITH ' + data.video_details + ' VIDEO');
          })
          .on('progress', function(progress: any) {
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
          .on("error", function (err: any) {
              console.log("error: ", err);
              reject({ message: "error occured " + err });
          })
          .on("end", function (err: any) {
              if (!err) {
                  console.log("video trim conversion Done");
                  resolve({ message: 'video trim conversion Done' })
              }
          })
          .saveToFile(modifiedImageUrl);

  })
};

const getVideoInfo = (imageUrl: string) => {
  return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(imageUrl, (error: any, videoInfo: any) => {
          if (error) {
              console.log(error)
            return reject(error);
          }
          // console.log('videoInfo', videoInfo.streams[0]);
          resolve(videoInfo.streams[0]);
      })
  })
};

const makeModifiedPath = (dataUrl: string, addText: string) => {
  const imageUrlArray = dataUrl.split('.');
  const fileType = imageUrlArray.pop();
  const withoutFileType = imageUrlArray.join('');
  
  let modifiedPath;
  if (fileType) {
    modifiedPath = withoutFileType + `-${addText}.` + fileType.toLowerCase();
  }

  return modifiedPath;
};

const createReturnPost = (post: any) => {

  const port = process.env.PORT || 4001;

      const fileUrls = [];
      if (post.fileUrls && post.fileUrls.length > 0) {
        if (!process.env.S3NOTUSE) {
          for (const fileUrl of post.fileUrls) {
            fileUrls.push(
              s3.getSignedUrl("getObject", {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: fileUrl,
                Expires: 60 * 60 * 24 * 365,
              })
            );
          }
        }

        if (process.env.S3NOTUSE) {
          for (const fileUrl of post.fileUrls) {
            // fileUrls.push(`http://localhost:${port}/${fileUrl}`);
            fileUrls.push(fileUrl);
          }
        }
      }

      return {
        ...post._doc,
        fileUrls: fileUrls,
      }
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
}