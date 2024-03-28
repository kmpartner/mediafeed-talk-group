const pushSubscription = require('../../models/push-notification/push-subscription');

exports.getPushSubscriptions = async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    const error = new Error('userId not found');
    error.statusCode = 400;
    throw error;
  }

  const pushData = await pushSubscription.find();
  console.log(pushData);

  if (!pushData) {
    const error = new Error('push subscriptions not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ message: 'get push subscription data success', data: pushData });
}

exports.getPushSubscription = async (req, res, next) => {
  const userId = req.query.userId;

  let subUserAgent = req.headers['user-agent'].split('(')[1];
  subUserAgent = subUserAgent.split(')')[0];
  // console.log('subUserAgent', subUserAgent);

  if (!userId) {
    const error = new Error('userId not found');
    error.statusCode = 400;
    throw error;
  }

  const userPushData = await pushSubscription.findOne({ 
    userId: userId,
    subUserAgent: subUserAgent
   });

   if (!userPushData) {
    const newSubscription = new pushSubscription({
      userId: userId,
      subUserAgent: subUserAgent,
    });
    await newSubscription.save();
  }

  if (!userPushData) {
    const error = new Error('push subscription for userId not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ message: 'get user push subscription data success', data: userPushData });

}

exports.updatePushSubscription = async (req, res, next) => {
  const pushData = req.body;
  // console.log('pushData', pushData);
  // console.log('req.headers[user-agent]', req.headers['user-agent']);
  
  let subUserAgent = req.headers['user-agent'].split('(')[1];
  subUserAgent = subUserAgent.split(')')[0];
  // console.log('subUserAgent', subUserAgent);

  if (!pushData.userId) {
    const error = new Error('userId for push subscription update not found');
    error.statusCode = 400;
    throw error;
  }

  let userPushData;
  // userPushData = await pushSubscription.findOne({ userId: pushData.userId });
  userPushData = await pushSubscription.findOne({ 
    userId: pushData.userId,
    subUserAgent: subUserAgent
  });
  // console.log('userPushData', userPushData);

  if (!userPushData) {
  // if (!userPushData || userPushData.length === 0) {
    userPushData = new pushSubscription({
      subscription: pushData.subscription,
      userId: pushData.userId,
      updateTime: pushData.updateTime,
      disabled: pushData.disabled === 'true' ? true : false,
      // messageNotify: true,
      // talkNotify: true,
      subUserAgent: subUserAgent,
    });
    await userPushData.save();

  }
  else {
    userPushData.subscription = pushData.subscription;
    userPushData.userId = pushData.userId;
    userPushData.updateTime = pushData.updateTime;
    userPushData.disabled = pushData.disabled === 'true' ? true : false;
    // userPushData.messageNotify = true;
    // userPushData.talkNotify = true;
    userPushData.subUserAgent = subUserAgent;
    await userPushData.save();
  }

  res.status(200).json({ message: 'push subscription updated', data: userPushData });

}

exports.deletePushSubscription = async (req, res, next) => {
  const userId = req.body.userId;
  // console.log('userId', userId);
  let subUserAgent = req.headers['user-agent'].split('(')[1];
  subUserAgent = subUserAgent.split(')')[0];
  // console.log('subUserAgent', subUserAgent);

  const userPushData = await pushSubscription.findOne({ 
    userId: userId,
    subUserAgent: subUserAgent
  });

  if (!userPushData) {
    const error = new Error('push subscription for userId not found');
    error.statusCode = 404;
    throw error;
  }

  userPushData.subscription = null;
  userPushData.updateTime = Date.now();
  userPushData.disabled = true;
  // userPushData.messageNotify = false;
  // userPushData.talkNotify = false;
  await userPushData.save();

  res.status(200).json({ message: 'push subscription for userId deleted', data: userPushData });
}