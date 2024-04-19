
const { getUserNameData } = require('../user-name-data/user-name-data-util.js');
const { 
    addFeedPostPageNotification,
} = require('../page-notification/page-notification-util.js');
const {
    sendMessagePushNotification,    
} = require('../push-notification/message-push-notification-util.js');

const sendFeedPostNotifications = async (
  post, 
  userId, 
  authHeader,
  userNameData, 
  sendType,
) => {
  try {
    let token;

    if (authHeader) {
      token = authHeader.split(' ')[1];
    }

    if (!userNameData || userNameData.userId !== userId || 
        !userNameData.name
    ) {
        userNameData = await getUserNameData(
            token, 
            userId,
            null,
        )
    }

    if (sendType === 'pageAndPush') {
      addFeedPostPageNotification(
          userId, 
          post,
          userNameData,
      );

      sendMessagePushNotification(
          userId, 
          post,
          userNameData,
      );
    }

    if (sendType === 'page') {
      addFeedPostPageNotification(
          userId, 
          post,
          userNameData,
      );
    }

    if (sendType === 'push') {
      sendMessagePushNotification(
          userId, 
          post,
          userNameData,
      );
    }

  } catch(err) {
    console.log(err);
    // throw err;
  }
}

module.exports = {
  sendFeedPostNotifications,
}