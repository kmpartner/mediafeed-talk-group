const webpush = require('web-push');

const PushSubscription = require('../../models/push-notification/push-subscription');
const FavoritePost = require('../../models/feed/favarite-post');
const FollowerTable = require('../../models/feed/follower-table');
const messagePush = require('../../models/push-notification/message-push');
const Post = require('../../models/feed/post.js');
// const Follow = require('../models/follow');
// const pushNotify = require('../models/push-notify');

const db = require('../../db');

// var serviceAccount = require("../../credentials/credentials.json");
// const vapidData = serviceAccount.vapid;

const vapidData = {
  mailto: process.env.VAPID_MAILTO,
    vapidKeys: {
      publicKey: process.env.VAPID_PUBLICKEY,
      privateKey:process.env.VAPID_PRIVATEKEY
    }
};


// exports.pushTest2 = async (req, res, next) => {
//   try {
//     // console.log('req.body', req.body);
//     // const userId = req.body.userId;
//     const userId = req.userId;
//     const postData = req.body.postData;
//     // console.log('postData', postData);

 
//     if (postData.public !== 'public') {
//       return;
//     }

//     // const followData = await db.getDb().collection("follows").find({}).toArray();
//     const favoritePostData = await FavoritePost.find({
//       postId: postData._id
//     });
//     const followerTableData = await FollowerTable.find({
//       followingUserId: userId
//     });

//     // return;
//     const candidateIds = [];

//     for (const element of favoritePostData) {
//       if (element.userId !== userId) {
//         candidateIds.push(element.userId);
//       }
//     }

//     for (const element of followerTableData) {
//       if (element.userId !== userId) {
//         candidateIds.push(element.userId);
//       }
//     }

//     console.log('candidateIds', candidateIds);

//     if (candidateIds.length === 0) {
//       return;
//     }

//     function onlyUnique(value, index, self) {
//       return self.indexOf(value) === index;
//     }

//     var uniqueIds = candidateIds.filter(onlyUnique);
//     console.log('uniqueIds', uniqueIds);


//   // try {

//     webpush.setVapidDetails(
//       vapidData.mailto,
//       vapidData.vapidKeys.publicKey,
//       vapidData.vapidKeys.privateKey
//     );
    
//     const pushData = await db.getDb().collection("pushsubscriptions").find().toArray();
//     // console.log('pushData', pushData);
    
//     const subPushData = [];
//     for (const data of pushData) {
//       const isInUniqueIds = uniqueIds.find(element => {
//         return element === data.userId;
//       });

//       if (isInUniqueIds) {
//         subPushData.push(data);
//       }
//     }

//     console.log('subPushData', subPushData);
//     if (subPushData.length === 0) {
//       return;
//     }


//     const pushContent = {
//       title: `post update by user ${postData.creatorName}`,
//       content: `${postData.title}`,
//       openUrl: `/feed/${postData ? postData._id : 'posts'}`,
//       // postData: postData
//     };
    
//     // const sendPushData = await sendPush(pushData, pushContent);
//     const sendPushData = await sendPush(subPushData, pushContent);
//     console.log('sendPushData', sendPushData);

//     const pushNotifyRecord = new messagePush({
//       pushTime: Date.now(),
//       pushContent: pushContent,
//       pushUserIds: sendPushData.sendIdList,
//       clientUserId: userId,
//     });
//     await pushNotifyRecord.save();


//     // post.pushNotificationSend = true;
//     // await post.save();
//     // console.log('pushNotifyRecord', pushNotifyRecord);

//     res.status(200).json({ 
//       message: 'Push notification send', 
//       data: pushNotifyRecord
//       });

//   }  catch (err) {
//     if (!err.statusCode) {
//         err.statusCode = 500;
//     }
//     next(err);
//   }

// }


const sendPush = (subscriptions, payloadObj) => {
  return new Promise(async (resolve, reject) => {

    //// firebase data is object 
    ////  but there is forEach function https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#foreach
    
    // let subObjLength = Object.keys(subscriptions.val()).length;
    // console.log('subscriptions.val()', subscriptions.val());
    // console.log('subObjLength', subObjLength);
    
    let processNum = 0;
    const sendIdList = [];
    const subArray = [];

    for (const sub of subscriptions) {
      if (sub.subscription) {
        subArray.push(sub);
      }
    }

    // const subValues = subscriptions.val();
    // console.log(subValues);
    // const subArray = [];

    // for (const key in subValues) {
    //   if (subValues[key].subscription) {
    //     subArray.push(subValues[key]);
    //   }
    // }
    // console.log(subArray);

    subArray.forEach((sub, index, array) => {
    // subArray.forEach((sub, index, array) => {
      // let pushConfig = {
      //   endpoint: sub.val().subscription.endpoint,
      //   keys: {
      //     auth: sub.val().subscription.keys.auth,
      //     p256dh: sub.val().subscription.keys.p256dh
      //   }
      // }
      let pushConfig = {
        endpoint: sub.subscription.endpoint,
        keys: {
          auth: sub.subscription.keys.auth,
          p256dh: sub.subscription.keys.p256dh
        }
      }

      webpush.sendNotification(pushConfig, JSON.stringify(payloadObj))
        .then(result => {
          console.log(result);
          // console.log(
          // ' uid ', sub.uid, ' p256dh ', pushConfig.keys.p256dh
          // );
          processNum++;
          sendIdList.push(sub.userId);
          console.log('processNum', processNum, 'sendIdList', sendIdList);
          if (processNum === array.length) {
            resolve({ 
              message: 'push notification send', 
              number: processNum,
              sendIdList: sendIdList,
            });
          }
        })
        .catch((err) => {
          processNum++;
          console.log(err);
        })

    });

  })
}



// const webpush = require('web-push');

// const pushSubscription = require('../models/push-subscription');
// const messagePush = require('../models/message-push');
// const Follow = require('../models/follow');
// // const pushNotify = require('../models/push-notify');

// // var serviceAccount = require("../../credentials/credentials.json");
// // const vapidData = serviceAccount.vapid;

// const vapidData = {
//   mailto: process.env.VAPID_MAILTO,
//     vapidKeys: {
//       publicKey: process.env.VAPID_PUBLICKEY,
//       privateKey:process.env.VAPID_PRIVATEKEY
//     }
// };


// let followData;

// const getFollowData = async () => {
//   // let fnum = 0;
//   followData = await Follow.find({});

//   setInterval( async () => {
//     followData = await Follow.find({});
//     // fnum++
//     // console.log(fnum);
//   }, 1000*60*5)

//   // console.log('followData', followData);
// }

// getFollowData();


// exports.pushTest2 = async (req, res, next) => {
//   console.log('req.body', req.body);
//   const userId = req.body.userId;
//   const postData = req.body.postData;

//   if (!userId) {
//     const error = new Error('userId not found');
//     error.statusCode = 400;
//     throw error;
//   }

//   if (postData.public !== 'public') {
//     return;
//   }

//   const candidateIds = [];

//   for (const element of followData) {
//     const isInFollowingUser = element.followingUsers.find(user => {
//       return user.userId === postData.creatorId;
//     });
//     // console.log('isInFollowingUser', isInFollowingUser, 'userId', element.userId);
    
//     if (isInFollowingUser) {
//       candidateIds.push(element.userId);
//     }

//     const isInFavorite = element.favoritePosts.find(post => {
//       return post.postId === postData._id;
//     });
//     // console.log('isInFavorite', isInFavorite, 'userid', element.userId);
    
//     if (isInFavorite) {
//       candidateIds.push(element.userId);
//     }
//   }

//   console.log('candidateIds', candidateIds);

//   if (candidateIds.length === 0) {
//     return;
//   }

//   function onlyUnique(value, index, self) {
//     return self.indexOf(value) === index;
//   }

//   var uniqueIds = candidateIds.filter(onlyUnique);
//   console.log('unique', uniqueIds);


//   try {

//     webpush.setVapidDetails(
//       vapidData.mailto,
//       vapidData.vapidKeys.publicKey,
//       vapidData.vapidKeys.privateKey
//     );
    
//     const pushData = await pushSubscription.find();
//     // console.log('pushData', pushData);
    
//     const subPushData = [];
//     for (const data of pushData) {
//       const isInUniqueIds = uniqueIds.find(element => {
//         return element === data.userId;
//       });

//       if (isInUniqueIds) {
//         subPushData.push(data);
//       }
//     }

//     console.log('subPushData', subPushData);
//     if (subPushData.length === 0) {
//       return;
//     }


//     const pushContent = {
//       title: `post update by user ${postData.creatorName}`,
//       content: `${postData.title}`,
//       openUrl: `/feed/${postData ? postData._id : 'posts'}`,
//       // postData: postData
//     };
    
//     // const sendPushData = await sendPush(pushData, pushContent);
//     const sendPushData = await sendPush(subPushData, pushContent);
//     console.log('sendPushData', sendPushData);

//     const pushNotifyRecord = new messagePush({
//       pushTime: Date.now(),
//       pushContent: pushContent,
//       pushUserIds: sendPushData.sendIdList,
//       clientUserId: userId,
//     });
//     await pushNotifyRecord.save();

//     // console.log('pushNotifyRecord', pushNotifyRecord);

//     res.status(200).json({ 
//       message: 'Push notification send', 
//       data: pushNotifyRecord
//       });

//   }  catch (err) {
//     if (!err.statusCode) {
//         err.statusCode = 500;
//     }
//     next(err);
//   }

// }


// const sendPush = (subscriptions, payloadObj) => {
//   return new Promise(async (resolve, reject) => {

//     //// firebase data is object 
//     ////  but there is forEach function https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#foreach
    
//     // let subObjLength = Object.keys(subscriptions.val()).length;
//     // console.log('subscriptions.val()', subscriptions.val());
//     // console.log('subObjLength', subObjLength);
    
//     let processNum = 0;
//     const sendIdList = [];
//     const subArray = [];

//     for (const sub of subscriptions) {
//       if (sub.subscription) {
//         subArray.push(sub);
//       }
//     }

//     // const subValues = subscriptions.val();
//     // console.log(subValues);
//     // const subArray = [];

//     // for (const key in subValues) {
//     //   if (subValues[key].subscription) {
//     //     subArray.push(subValues[key]);
//     //   }
//     // }
//     // console.log(subArray);

//     subArray.forEach((sub, index, array) => {
//     // subArray.forEach((sub, index, array) => {
//       // let pushConfig = {
//       //   endpoint: sub.val().subscription.endpoint,
//       //   keys: {
//       //     auth: sub.val().subscription.keys.auth,
//       //     p256dh: sub.val().subscription.keys.p256dh
//       //   }
//       // }
//       let pushConfig = {
//         endpoint: sub.subscription.endpoint,
//         keys: {
//           auth: sub.subscription.keys.auth,
//           p256dh: sub.subscription.keys.p256dh
//         }
//       }

//       webpush.sendNotification(pushConfig, JSON.stringify(payloadObj))
//         .then(result => {
//           console.log(result);
//           // console.log(
//           // ' uid ', sub.uid, ' p256dh ', pushConfig.keys.p256dh
//           // );
//           processNum++;
//           sendIdList.push(sub.userId);
//           console.log('processNum', processNum, 'sendIdList', sendIdList);
//           if (processNum === array.length) {
//             resolve({ 
//               message: 'push notification send', 
//               number: processNum,
//               sendIdList: sendIdList,
//             });
//           }
//         })
//         .catch((err) => {
//           processNum++;
//           console.log(err);
//         })

//     });

//   })
// }