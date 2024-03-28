export {}
const fs = require('fs');
const aws = require('aws-sdk');
const mime = require('mime-types');

const TextTalk = require('../models/text-talk');
const { s3DeleteMany, clearImage } = require('./file-upload-utils');
// const { acceptVideoExt } = require('./middleware/multer');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();


const deleteOldMediaFiles = async () => {
  try {
    console.log('old-videos-deletion-start');
    //// loop text talk and delete old videos

    const limit = 1000*60*60*24*31;
    // const limit = 1000*60;

    const allTextTalks = await TextTalk.find();

    for (const textTalk of allTextTalks) {

      if (new Date(textTalk.updatedAt).getTime() < Date.now() - limit*12) {
        continue;
      }

      // console.log('updatedAt', new Date(textTalk.updatedAt).getTime());
      const userTalks = textTalk.talk;

      if (userTalks && userTalks.length > 0) {
        for (const userTalk of userTalks) {
          const textList = userTalk.text;
          
          if (textList && textList.length > 0) {
            for (const text of textList) {

              const fileUrls = text.fileUrls;
              // console.log('fileUrls', fileUrls);

              const videoPaths = fileUrls.filter((path: any) => {

                let isVideoAudioFile = false;

                const mimeType = mime.lookup(path);
                
                if (mimeType && mimeType.split('/')[0] === 'video' ||
                    mimeType && mimeType.split('/')[0] === 'audio'
                ) {
                  isVideoAudioFile = true;
                }
                // console.log('mimeType', mimeType, isVideoAudioFile);

                const isOldFile = text.sendAt + limit < Date.now();
                // console.log('isOldFile', isOldFile, text.sendAt, Date.now());

                if (isVideoAudioFile && isOldFile) {
                  return path;
                }
              });

              // console.log('videoPaths', videoPaths)

              if (!process.env.S3NOTUSE && videoPaths.length > 0) {
                const deleteObjects = [];

                for (const videoPath of videoPaths) {
                  deleteObjects.push({
                      Key: videoPath,
                  });
                }
  
                const deleteParam = {
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Delete: {
                        Objects: deleteObjects,
                        // Quiet: false
                    }
                };
                
                  await s3DeleteMany(deleteParam);
              }

              if (process.env.S3NOTUSE && videoPaths.length > 0) {
                for (const videoPath of videoPaths) {
                  console.log('s3notuse', process.env.S3NOTUSE, videoPath)
                  
                  if (fs.existsSync(videoPath)) {
                    //file exists
                    clearImage(videoPath);
                  }
                }
              }

            }
          }
        }
      }
    }
  } catch(err) {
    console.log(err);
  }

};

module.exports = {
  deleteOldMediaFiles,
}