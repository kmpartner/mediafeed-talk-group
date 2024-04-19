const webpush = require('web-push');

const CommentPush = require('../../models/push-notification/comment-push');
const PushSubscription = require('../../models/push-notification/push-subscription');

const db = require('../../db');

const vapidData = {
  mailto: process.env.VAPID_MAILTO,
    vapidKeys: {
      publicKey: process.env.VAPID_PUBLICKEY,
      privateKey:process.env.VAPID_PRIVATEKEY
    }
};




//// send push notification to post creator, about comment on post by other users
const sendCommentPushNotification = async (
  commentData, 
  postCreatorId,
  userNameData,
) => {
  try {
    // console.log(req.body);
    // const userId = req.body.userId;
    // const commentData = req.body.commentData;
    // const postId = req.body.postId;
    // const postCreatorId = req.body.postCreatorId;

    if (commentData.creatorId === postCreatorId) {
      return;
    }

    webpush.setVapidDetails(
      vapidData.mailto,
      vapidData.vapidKeys.publicKey,
      vapidData.vapidKeys.privateKey
    );
    
    const pushData = await db.getDb().collection("pushsubscriptions").find().toArray();
    // console.log('pushData', pushData);
    
    const subPushData = [];
    for (const data of pushData) {

      if (data.userId === postCreatorId) {
        subPushData.push(data);
      }
    }

    console.log('subPushData', subPushData);
    if (subPushData.length === 0) {
      return;
    }

    let modifyContent = commentData.content;
    if (commentData.content.length > 50) {
      modifyContent = commentData.content.slice(0,50) + '.....'
    } 

    const pushContent = {
      title: `new comment by user ${userNameData?.name}`,
      content: `${modifyContent}`,
      openUrl: `/feed/${commentData.postId ? commentData.postId : 'posts'}`,
      // postData: postData
    };
    
    // const sendPushData = await sendPush(pushData, pushContent);
    const sendPushData = await sendPush(subPushData, pushContent);
    console.log('sendPushData', sendPushData);

    // const pushNotifyRecord = new CommentPush({
    //   pushTime: Date.now(),
    //   pushContent: pushContent,
    //   pushUserIds: sendPushData.sendIdList,
    //   clientUserId: userId,
    // });
    // await pushNotifyRecord.save();


    // commentData.pushNotificationSend = true;
    // await commentData.save();


    // console.log('pushNotifyRecord', pushNotifyRecord);

    return pushContent

  }  catch (err) {
    console.log(err);
    // throw err;
  }
};



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


module.exports = {
  sendCommentPushNotification,
}

