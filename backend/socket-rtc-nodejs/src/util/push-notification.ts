const webpush = require('web-push');

// const PushSubscription = require('../models/push-subscription');
// const groupPush = require('../models/group-push');
const TalkPush = require('../models/talk-push');

require('dotenv').config();

const db = require('../db');

// var serviceAccount = require("../../credentials/credentials.json");
// const vapidData = serviceAccount.vapid;

const vapidData = {
  mailto: process.env.VAPID_MAILTO,
    vapidKeys: {
      publicKey: process.env.VAPID_PUBLICKEY,
      privateKey:process.env.VAPID_PRIVATEKEY
    }
};

// exports.getTest = async(req: any, res: any, next: any) => {
//   res.status(200).json({ message: 'get success'});
// }

// exports.pushTest = async (req: any, res: any, next: any) => {
//   console.log('req.body', req.body);
//   const userId = req.body.userId;
//   const textData = req.body.textData;

//   if (!userId) {
//     const error = new Error('userId not found');
//     // error.statusCode = 400;
//     throw error;
//   }

//   try {

//     webpush.setVapidDetails(
//       vapidData.mailto,
//       vapidData.vapidKeys.publicKey,
//       vapidData.vapidKeys.privateKey
//     );
    
//     // const pushData = await PushSubscription.find({});
//     const pushData = await db.getDb().collection("pushsubscriptions").find().toArray();
//     console.log('pushData', pushData);
    
//     const pushContent = {
//       // title: `new text from ${textData.fromName}`,
//       // content: `${textData.text}`,
//       // openUrl: `/talk-page`,
//       title: `test push `,
//       content: `test push content`,
//       openUrl: `/talk-page`,
//       // postData: postData
//     };
    
//     const sendPushData: any = await sendPush(pushData, pushContent);
//     // console.log('sendPushData', sendPushData);

//     const pushNotifyRecord = new groupPush({
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


// exports.pushTextToUser = async (req, res, next) => {
//   console.log('req.body', req.body);
//   const userId = req.body.userId;
//   const textData = req.body.textData;

//   if (!userId) {
//     const error = new Error('userId not found');
//     error.statusCode = 400;
//     throw error;
//   }

//   try {

//     webpush.setVapidDetails(
//       vapidData.mailto,
//       vapidData.vapidKeys.publicKey,
//       vapidData.vapidKeys.privateKey
//     );
    
//     const pushData = await PushSubscription.find({ userId: textData.toUserId });
//     // const pushData = await db.getDb()
//     //   .collection("pushsubscriptions")
//     //   .find({ userId: textData.toUserId })
//     //   .toArray();
//     console.log('pushData', pushData);
    
//     if (!pushData || pushData.length === 0) {
//       return;
//       res.status(404).json({ message: 'push subscription for toUserId not found' });
//       // const error = new Error('push subscripton of toUserId not found');
//       // error.statusCode = 404;
//       // throw error;
//     }


//     let modifyContent = textData.text;
//     if (textData.text.length > 100) {
//       modifyContent = textData.text.slice(0,100) + '.....'
//     } 

//     const pushContent = {
//       title: `new text from user ${textData.fromName}`,
//       content: `${modifyContent}`,
//       openUrl: `/talk-page/?grouptotalk=${textData.fromName}`,
//       // postData: postData
//     };
    
//     const sendPushData = await sendPush(pushData, pushContent);
//     // console.log('sendPushData', sendPushData);

//     const pushNotifyRecord = new talkPush({
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


export const pushTextToUser2 = (userId: string, textData: any) => {
  return new Promise( async (resolve, reject) => {
  // console.log('req.body', req.body);
  // const userId = req.body.userId;
  // const textData = req.body.textData;

  if (!userId) {
    const error = new Error('userId not found');
    // error.statusCode = 400;
    throw error;
  }

  try {

    webpush.setVapidDetails(
      vapidData.mailto,
      vapidData.vapidKeys.publicKey,
      vapidData.vapidKeys.privateKey
    );
    
    // const pushData = await PushSubscription.find({ userId: textData.toUserId });
    const pushData = await db.getDb()
      .collection("pushsubscriptions")
      .find({ userId: textData.toUserId })
      .toArray();
      
    // console.log('pushData', pushData);
    
    if (!pushData || pushData.length === 0) {
      return;
      // res.status(404).json({ message: 'push subscription for toUserId not found' });
      const error = new Error('push subscripton of toUserId not found');
      // error.statusCode = 404;
      throw error;
    }


    let modifyContent = textData.text;
    if (textData.text.length > 100) {
      modifyContent = textData.text.slice(0,100) + '.....'
    } 

    const pushContent = {
      title: `new text from user ${textData.fromName}`,
      content: `${modifyContent}`,
      openUrl: `/talk-page/?grouptotalk=${textData.fromName}`,
      // postData: postData
    };
    
    const sendPushData: any = await sendPush(pushData, pushContent);
    // console.log('sendPushData', sendPushData);

    const pushNotifyRecord = new TalkPush({
      pushTime: Date.now(),
      pushContent: pushContent,
      pushUserIds: sendPushData.sendIdList,
      clientUserId: userId,
    });
    await pushNotifyRecord.save();

    // console.log('pushNotifyRecord', pushNotifyRecord);

    // res.status(200).json({ 
    //   message: 'Push notification send', 
    //   data: pushNotifyRecord
    //   });

    resolve({ 
        message: 'Push notification send', 
        data: pushNotifyRecord
      });

  }  catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    reject(err);
    // next(err);
  }
  });
  
}



// exports.pushTextToUsers = async (req: any, res: any, next: any) => {
//   console.log('req.body', req.body);
//   const userId = req.body.userId;
//   const sendIds = req.body.sendIds;
//   const textData = req.body.textData;
//   const groupRoomId = req.body.textData.groupRoomId

//   if (sendIds.length === 0) {
//     return
//     const error = new Error('userId not found');
//     // error.statusCode = 400;
//     throw error;
//   }

//   try {

//     webpush.setVapidDetails(
//       vapidData.mailto,
//       vapidData.vapidKeys.publicKey,
//       vapidData.vapidKeys.privateKey
//     );
    
//     // const pushData = await pushSubscription.find({ userId: textData.toUserId });
//     // const pushData = await db.getDb()
//     //   .collection("pushsubscriptions")
//     //   .find({ userId: textData.toUserId })
//     //   .toArray();

//     // const allSubscriptions = await PushSubscription.find({});
//     let pushData: any[] = [];

//     for (const id of sendIds) {
//       // const userInSubscriptions = await PushSubscription.find({ userId: id });
//       const userInSubscriptions = await db.getDb().collection("pushsubscriptions").find({ userId: id }).toArray();
//       // console.log('userInSubscriptions', userInSubscriptions,)
      
//       if (userInSubscriptions.length > 0) {
//         pushData = pushData.concat(userInSubscriptions);
//         // console.log('pushData', pushData);
//       }
//     }

//     console.log('pushData', pushData);
    
//     if (!pushData || pushData.length === 0) {
//       return;
//       res.status(404).json({ message: 'push subscription for toUserId not found' });
//       // const error = new Error('push subscripton of toUserId not found');
//       // error.statusCode = 404;
//       // throw error;
//     }


//     let modifyContent = textData.text;
//     if (textData.text.length > 100) {
//       modifyContent = textData.text.slice(0,100) + '.....'
//     } 

//     const pushContent = {
//       title: `new text in Group`,
//       content: `${modifyContent}`,
//       openUrl: `/group-talk-page/?groupRoomIdPush=${groupRoomId}`,
//       // postData: postData
//     };
    
//     const sendPushData: any = await sendPush(pushData, pushContent);
//     // console.log('sendPushData', sendPushData);

//     const pushNotifyRecord = new groupPush({
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


// export const pushTextToUsers2 = (
//   userId: string, 
//   sendIds: string[], 
//   textData: any, 
//   groupRoomId: string
// ) => {
//   return new Promise( async (resolve, reject) => {
//     if (sendIds.length === 0) {
//       // return
//       const error = new Error('sned userIds not found');
//       // error.statusCode = 400;
//       throw error;
//     }
  
//     try {
//       webpush.setVapidDetails(
//         vapidData.mailto,
//         vapidData.vapidKeys.publicKey,
//         vapidData.vapidKeys.privateKey
//       );
      
//       // const pushData = await pushSubscription.find({ userId: textData.toUserId });
//       // const pushData = await db.getDb()
//       //   .collection("pushsubscriptions")
//       //   .find({ userId: textData.toUserId })
//       //   .toArray();
  
//       // const allSubscriptions = await PushSubscription.find({});
//       let pushData: any[] = [];
  
//       for (const id of sendIds) {
//         // const userInSubscriptions = await PushSubscription.find({ userId: id });
//         const userInSubscriptions = await db.getDb().collection("pushsubscriptions").find({ userId: id }).toArray();
//         // console.log('userInSubscriptions', userInSubscriptions,)
        
//         if (userInSubscriptions.length > 0) {
//           pushData = pushData.concat(userInSubscriptions);
//           // console.log('pushData', pushData);
//         }
//       }
  
//       // console.log('pushData', pushData);
      
//       if (!pushData || pushData.length === 0) {
//         // return;
//         // res.status(404).json({ message: 'push subscription for toUserId not found' });
//         const error = new Error('push subscripton of toUserId not found');
//         // error.statusCode = 404;
//         throw error;
//       }
  
  
//       let modifyContent = textData.text;
//       if (textData.text.length > 100) {
//         modifyContent = textData.text.slice(0,100) + '.....'
//       } 
  
//       const pushContent = {
//         title: `new text in Group`,
//         content: `${modifyContent}`,
//         openUrl: `/group-talk-page/?groupRoomIdPush=${groupRoomId}`,
//         // postData: postData
//       };
      
//       const sendPushData: any = await sendPush(pushData, pushContent);
//       // console.log('sendPushData', sendPushData);
  
//       const pushNotifyRecord = new groupPush({
//         pushTime: Date.now(),
//         pushContent: pushContent,
//         pushUserIds: sendPushData.sendIdList,
//         clientUserId: userId,
//       });
//       await pushNotifyRecord.save();

//       // const pushNotifyRecord = {
//       //   pushTime: Date.now(),
//       //   pushContent: pushContent,
//       //   pushUserIds: sendPushData.sendIdList,
//       //   clientUserId: userId,
//       // }
  
//       // console.log('pushNotifyRecord', pushNotifyRecord);
  
//       resolve({ 
//         message: 'Push notification send', 
//         data: pushNotifyRecord
//       });
//       // res.status(200).json({ 
//       //   message: 'Push notification send', 
//       //   data: pushNotifyRecord
//       // });
  
//     }  catch (err) {
//       if (!err.statusCode) {
//           err.statusCode = 500;
//       }
//       reject(err);
//       // next(err);
//     }
//   });

  
// }

const sendPush = (subscriptions: any, payloadObj: any) => {
  return new Promise(async (resolve, reject) => {

    let processNum = 0;
    const sendIdList: any[] = [];
    const subArray: any[] = [];

    for (const sub of subscriptions) {
      if (sub.subscription) {
        subArray.push(sub);
      }
    }
    // console.log(subArray);


    subArray.forEach((sub, index, array) => {

      let pushConfig = {
        endpoint: sub.subscription.endpoint,
        keys: {
          auth: sub.subscription.keys.auth,
          p256dh: sub.subscription.keys.p256dh
        }
      }

      webpush.sendNotification(pushConfig, JSON.stringify(payloadObj))
        .then((result: any) => {
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
        .catch((err: any) => {
          console.log(err);

          processNum++;
          if (processNum === array.length) {
            resolve({ 
              message: 'push notification send', 
              number: processNum,
              sendIdList: sendIdList,
            });
          }
        })

    });

  })
}