const webpush = require('web-push');

const PushSubscription = require('../../models/push-notification/push-subscription');
const talkPush = require('../../models/push-notification/talk-push');
const groupPush = require('../../models/push-notification/group-push');

require('dotenv').config();

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



exports.pushTest = async (req, res, next) => {
  console.log('req.body', req.body);
  const userId = req.body.userId;
  const textData = req.body.textData;

  if (!userId) {
    const error = new Error('userId not found');
    error.statusCode = 400;
    throw error;
  }

  try {

    webpush.setVapidDetails(
      vapidData.mailto,
      vapidData.vapidKeys.publicKey,
      vapidData.vapidKeys.privateKey
    );
    
    const pushData = await PushSubscription.find({});
    // const pushData = await db.getDb().collection("pushsubscriptions").find().toArray();
    console.log('pushData', pushData);
    
    const pushContent = {
      // title: `new text from ${textData.fromName}`,
      // content: `${textData.text}`,
      // openUrl: `/talk-page`,
      title: `test push `,
      content: `test push content`,
      openUrl: `/talk-page`,
      // postData: postData
    };
    
    const sendPushData = await sendPush(pushData, pushContent);
    // console.log('sendPushData', sendPushData);

    const pushNotifyRecord = new talkPush({
      pushTime: Date.now(),
      pushContent: pushContent,
      pushUserIds: sendPushData.sendIdList,
      clientUserId: userId,
    });
    await pushNotifyRecord.save();

    // console.log('pushNotifyRecord', pushNotifyRecord);

    res.status(200).json({ 
      message: 'Push notification send', 
      data: pushNotifyRecord
      });

  }  catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
  }
}


exports.pushTextToUser = async (req, res, next) => {
  console.log('req.body', req.body);
  const userId = req.body.userId;
  const textData = req.body.textData;

  if (!userId) {
    const error = new Error('userId not found');
    error.statusCode = 400;
    throw error;
  }

  try {

    webpush.setVapidDetails(
      vapidData.mailto,
      vapidData.vapidKeys.publicKey,
      vapidData.vapidKeys.privateKey
    );
    
    const pushData = await PushSubscription.find({ userId: textData.toUserId });
    // const pushData = await db.getDb()
    //   .collection("pushsubscriptions")
    //   .find({ userId: textData.toUserId })
    //   .toArray();
    console.log('pushData', pushData);
    
    if (!pushData || pushData.length === 0) {
      return;
      res.status(404).json({ message: 'push subscription for toUserId not found' });
      // const error = new Error('push subscripton of toUserId not found');
      // error.statusCode = 404;
      // throw error;
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
    
    const sendPushData = await sendPush(pushData, pushContent);
    // console.log('sendPushData', sendPushData);

    const pushNotifyRecord = new talkPush({
      pushTime: Date.now(),
      pushContent: pushContent,
      pushUserIds: sendPushData.sendIdList,
      clientUserId: userId,
    });
    await pushNotifyRecord.save();

    // console.log('pushNotifyRecord', pushNotifyRecord);

    res.status(200).json({ 
      message: 'Push notification send', 
      data: pushNotifyRecord
      });

  }  catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
  }
}

exports.pushTextToUsers = async (req, res, next) => {
  console.log('req.body', req.body);
  const userId = req.body.userId;
  const sendIds = req.body.sendIds;
  const textData = req.body.textData;
  const groupRoomId = req.body.textData.groupRoomId

  if (sendIds.length === 0) {
    return
    const error = new Error('userId not found');
    error.statusCode = 400;
    throw error;
  }

  try {

    webpush.setVapidDetails(
      vapidData.mailto,
      vapidData.vapidKeys.publicKey,
      vapidData.vapidKeys.privateKey
    );
    
    // const pushData = await pushSubscription.find({ userId: textData.toUserId });
    // const pushData = await db.getDb()
    //   .collection("pushsubscriptions")
    //   .find({ userId: textData.toUserId })
    //   .toArray();

    // const allSubscriptions = await PushSubscription.find({});
    let pushData = [];

    for (const id of sendIds) {
      const userInSubscriptions = await PushSubscription.find({ userId: id });
      // console.log('userInSubscriptions', userInSubscriptions,)
      
      if (userInSubscriptions.length > 0) {
        pushData = pushData.concat(userInSubscriptions);
        // console.log('pushData', pushData);
      }
    }

    console.log('pushData', pushData);
    
    if (!pushData || pushData.length === 0) {
      return;
      res.status(404).json({ message: 'push subscription for toUserId not found' });
      // const error = new Error('push subscripton of toUserId not found');
      // error.statusCode = 404;
      // throw error;
    }


    let modifyContent = textData.text;
    if (textData.text.length > 100) {
      modifyContent = textData.text.slice(0,100) + '.....'
    } 

    const pushContent = {
      title: `new text in Group`,
      content: `${modifyContent}`,
      openUrl: `/group-talk-page/?groupRoomIdPush=${groupRoomId}`,
      // postData: postData
    };
    
    const sendPushData = await sendPush(pushData, pushContent);
    // console.log('sendPushData', sendPushData);

    const pushNotifyRecord = new groupPush({
      pushTime: Date.now(),
      pushContent: pushContent,
      pushUserIds: sendPushData.sendIdList,
      clientUserId: userId,
    });
    await pushNotifyRecord.save();

    // console.log('pushNotifyRecord', pushNotifyRecord);

    res.status(200).json({ 
      message: 'Push notification send', 
      data: pushNotifyRecord
      });

  }  catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
  }
}

const sendPush = (subscriptions, payloadObj) => {
  return new Promise(async (resolve, reject) => {

    let processNum = 0;
    const sendIdList = [];
    const subArray = [];

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