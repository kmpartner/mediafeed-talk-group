const aws = require('aws-sdk');
const _ = require('lodash');

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


const getTalkPermissionUsers = async (req, res, next) => {
  try {
    const talkPermission = await TalkPermission.findOne({ userId: req.userId })

    // const acceptedUsers = [];
    const permissionUsers = [];

    if (talkPermission) {
      const combinedIds = talkPermission.talkAcceptUserIds
        .concat(talkPermission.talkAcceptedUserIds)
        .concat(talkPermission.talkRequestedUserIds)
        .concat(talkPermission.talkRequestingUserIds);

      const uniqList = _.uniqBy(combinedIds, ['userId']);

      const userIdList = [];

      for (const ele of uniqList) {
        userIdList.push(ele.userId);
      }

      const userList = await User.find({"userId": { "$in": userIdList }});

      for (const user of userList) {
          const port = process.env.PORT || 8083;
          let imageUrl;

          if (user.imageUrl && !process.env.S3NOTUSE) {
              imageUrl = s3.getSignedUrl('getObject', {
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Key: user.imageUrl ? user.imageUrl : 'dummy-key',
                  Expires: 60 * 60 * 24 * 365
              });
          }
          
          if (user.imageUrl && process.env.S3NOTUSE) {
              imageUrl = `http://localhost:${port}/${user.imageUrl}`;
          }

          permissionUsers.push({
            userId: user.userId,
            // email: acceptedUser.email,
            imageUrl: imageUrl,
            name: user.name,
            imagePath: user.imagePath,
            description: user.description,

            _id: user._id.toString(),
            userColor: user.userColor,

            createdAt: user.createdAt,
          });
        
      }
    }

    res.status(200).json({
      message: 'get talk permission users success', 
      data: permissionUsers,
    });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};


const getTalkDisplayUsers = async (req, res, next) => {
  try {
    const talkPermission = await TalkPermission.findOne({ userId: req.userId })

    const permissionUsers = [];

    if (talkPermission) {
      const combinedIds = talkPermission.talkAcceptUserIds
        .concat(talkPermission.talkAcceptedUserIds)
        .concat(talkPermission.talkRequestedUserIds)
        .concat(talkPermission.talkRequestingUserIds);

      const uniqList = _.uniqBy(combinedIds, ['userId']);

      const userIdList = [];

      for (const ele of uniqList) {
        userIdList.push(ele.userId);
      }

      const userList = await User.find({"userId": { "$in": userIdList }});

      for (const user of userList) {
          const port = process.env.PORT || 8083;
          let imageUrl;

          if (user.imageUrl && !process.env.S3NOTUSE) {
              imageUrl = s3.getSignedUrl('getObject', {
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Key: user.imageUrl ? user.imageUrl : 'dummy-key',
                  Expires: 60 * 60 * 24 * 365
              });
          }
          
          if (user.imageUrl && process.env.S3NOTUSE) {
              imageUrl = `http://localhost:${port}/${user.imageUrl}`;
          }

          permissionUsers.push({
            userId: user.userId,
            // email: acceptedUser.email,
            imageUrl: imageUrl,
            name: user.name,
            imagePath: user.imagePath,
            description: user.description,

            _id: user._id.toString(),
            userColor: user.userColor,

            createdAt: user.createdAt,
          });
        
      }
    }

    const suggestUsers = await createTalkSuggestUsers(req.userId);

    console.log('suggestUsers.length', suggestUsers.length);

    const onlySuggestUsers = [];

    for (const user of suggestUsers) {
      const isInPermssionUsers = permissionUsers.find(element => {
        return element.userId === user.userId;
      });

      if (!isInPermssionUsers) {
        onlySuggestUsers.push(user);
      }
    }

    console.log('onlySuggestUsers.length', onlySuggestUsers.length);
  
    const returnUsers = permissionUsers.concat(onlySuggestUsers);

    console.log('returnUsers.length', returnUsers.length);

    res.status(200).json({
      message: 'get talk display users success', 
      data: returnUsers,
    });

  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};


const createTalkSuggestUsers = async (userId) => {
  try {

    let userLanguage;
    let bUserLanguage;

    if (userId) {
      const user = await User.findOne({ userId: userId });

      if (!user) {
        const error = new Error('user not found');
        error.statusCode = 400;
        throw error;
      }

      if (user.acceptLanguage && user.acceptLanguage.split(',').length > 1) {
        userLanguage = user.acceptLanguage.split(',')[0];

        // console.log(user.acceptLanguage)
        if (userLanguage && userLanguage.split('-').length > 1) {
          bUserLanguage = userLanguage.split('-')[0];

          // console.log('bUserLanguage', bUserLanguage);
        }
      }
    }

    // console.log('userLanguage', userLanguage, bUserLanguage);


    let suggestUserList = []

      if (userLanguage) {
        // const languageUsers =  await User.find({ acceptLanguage: userLanguage });
        const languageUsers =  await User.find({ 
          acceptLanguage: { "$regex": `${userLanguage},`, "$options": "i" }
        })
        suggestUserList = languageUsers;
        // console.log('languageUsers', languageUsers);

        if (bUserLanguage) {
          const bLanguageUsers =  await User.find({ 
            acceptLanguage: { "$regex": `${bUserLanguage},`, "$options": "i" }
          });

          suggestUserList = suggestUserList.concat(bLanguageUsers);
        }
      }


      if (suggestUserList.length < 10000) {
        const userList = await User.find()
          .limit(100000);

        suggestUserList = suggestUserList.concat(userList);
      }

      // console.log('suggestUserList', suggestUserList);
      
      const uniqList = _.uniqBy(suggestUserList, ['userId']);

      // console.log('uniqList', uniqList);

      const userList = await User.find()
        .limit(100000);

      const suggestUsers = [];

      for (const user of userList) {
          const port = process.env.PORT || 8083;
          let imageUrl;

          if (user.imageUrl && !process.env.S3NOTUSE) {
              imageUrl = s3.getSignedUrl('getObject', {
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Key: user.imageUrl ? user.imageUrl : 'dummy-key',
                  Expires: 60 * 60 * 24 * 365
              });
          }
          
          if (user.imageUrl && process.env.S3NOTUSE) {
              imageUrl = `http://localhost:${port}/${user.imageUrl}`;
          }

          suggestUsers.push({
            userId: user.userId,
            // email: acceptedUser.email,
            imageUrl: imageUrl,
            name: user.name,
            imagePath: user.imagePath,
            description: user.description,

            _id: user._id.toString(),
            userColor: user.userColor,

            createdAt: user.createdAt,
          });
        
    }
    
    return suggestUsers;

  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getTalkAcceptedUsers,
  getTalkPermissionUsers,
  getTalkDisplayUsers,
}