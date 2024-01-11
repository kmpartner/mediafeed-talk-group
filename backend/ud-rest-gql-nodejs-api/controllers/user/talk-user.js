const aws = require('aws-sdk');

const User = require('../../models/user/user');
const TalkPermission = require('../../models/user/talk-permission');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();

const getTalkAcceptedUsers = async (req, res, next) => {
  try {
    const talkPermission = await TalkPermission.findOne({ userId: req.userId })

    const acceptedUsers = [];

    if (talkPermission && talkPermission.talkAcceptedUserIds.length > 0) {
      
      for (const acceptedUserId of talkPermission.talkAcceptedUserIds) {
        const acceptedUser = await User.findOne({ userId: acceptedUserId.userId });

        if (acceptedUser) {
          const port = process.env.PORT || 8083;
          let imageUrl;

          if (acceptedUser.imageUrl && !process.env.S3NOTUSE) {
              imageUrl = s3.getSignedUrl('getObject', {
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Key: acceptedUser.imageUrl ? acceptedUser.imageUrl : 'dummy-key',
                  Expires: 60 * 60 * 24 * 365
              });
          }
          
          if (acceptedUser.imageUrl && process.env.S3NOTUSE) {
              imageUrl = `http://localhost:${port}/${acceptedUser.imageUrl}`;
          }

          acceptedUsers.push({
            userId: acceptedUser.userId,
            // email: acceptedUser.email,
            imageUrl: imageUrl,
            name: acceptedUser.name,
            imagePath: acceptedUser.imagePath,
            description: acceptedUser.description,
          });
        }
      }
    }

    res.status(200).json({
      message: 'get user talk accepted users success', 
      data: acceptedUsers,
    });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};

module.exports = {
  getTalkAcceptedUsers,
}