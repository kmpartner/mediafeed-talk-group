export {}
const fs = require('fs');
const path = require('path');

const aws = require('aws-sdk');
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

module.exports = {
  s3Upload,
  s3DeleteMany,
  clearImage,
  isAudioFile,
  createSmallImage,
  makeModifiedPath,
}