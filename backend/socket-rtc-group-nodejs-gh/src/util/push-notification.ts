const webpush = require('web-push');

// const PushSubscription = require('../models/push-subscription');
// const groupPush = require('../models/group-push');
// const { getUserNameData } = require('./get-user-name-data-util');

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


export const pushTextToUsers2 = async (
  userId: string, 
  sendIds: string[], 
  textData: any, 
  groupRoomId: string,
  fromUserNameData: any,
) => {
    try {
      if (sendIds.length === 0) {
        return;
        // const error = new Error('sned userIds not found');
        // // error.statusCode = 400;
        // throw error;
      }
  
      // console.log('sendIds', sendIds);

      webpush.setVapidDetails(
        vapidData.mailto,
        vapidData.vapidKeys.publicKey,
        vapidData.vapidKeys.privateKey
      );
      
      let pushData: any[] = [];
  
      for (const id of sendIds) {
        // const userInSubscriptions = await PushSubscription.find({ userId: id });
        const userInSubscriptions = await db.getDb().collection("pushsubscriptions").find({ userId: id }).toArray();
        // console.log('userInSubscriptions', userInSubscriptions,)
        
        if (userInSubscriptions.length > 0) {
          pushData = pushData.concat(userInSubscriptions);
          // console.log('pushData', pushData);
        }
      }
  
      // console.log('pushData', pushData);
      
      if (!pushData || pushData.length === 0) {
        return;
        // const error = new Error('push subscripton of toUserId not found');
        // // error.statusCode = 404;
        // throw error;
      }
  
  
      let modifyContent = textData.text;
      if (textData.text.length > 100) {
        modifyContent = textData.text.slice(0,100) + '.....'
      } 
  
      const pushContent = {
        title: `new text in Group by ${fromUserNameData?.name}`,
        content: `${modifyContent}`,
        // openUrl: `/group-talk-page/?groupRoomIdPush=${groupRoomId}`,
        openUrl: `/group-talk-page/?pageNotificationGroupRoomId=${groupRoomId}`,
        // postData: postData
        fromUserNameData: fromUserNameData,
      };
      
      sendPush(pushData, pushContent);
      // await sendPush(pushData, pushContent);

      // console.log('sendPushData', sendPushData);
  
      // resolve({ 
      //   message: 'Push notification send', 
      //   // data: pushNotifyRecord,
      //   data: pushContent,
      // });

    }  catch (err: any) {
      console.log(err);
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      // reject(err);
      // next(err);
    }
};

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