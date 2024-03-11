const _ = require('lodash');
const PageNotification = require('../../models/page-notification/page-notification');

const { storePageNotificationData } = require('../../util/page-notification/page-notification-util');
const { getUserNameDataList } = require('../../util/user-name-data/user-name-data-util');

const getPageNotification = async (req, res, next) => {
  try {
    const userId = req.userId;

    let pageNotification = await PageNotification.findOne({ userId: userId });
    
    if (!pageNotification) {
      pageNotification = new PageNotification({
        userId: userId,
        pageNotificationList: [],
      });

      await pageNotification.save();
    }
    
    res.status(200).json({ 
      message: "get user page notification success",
      data: pageNotification, 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updatePageNotificationLastOpenTime = async (req, res, next) => {
  try {
    const userId = req.userId;

    const pageNotification = await PageNotification.findOne({ userId: userId });
    
    if (!pageNotification) {
      const error = new Error('pageNotification not found');
      error.statusCode = 404;
      throw error;
    }

    pageNotification.lastOpenTime = Date.now();

    await pageNotification.save();


    res.status(200).json({ 
      message: "update page notification last open time success",
      data: pageNotification, 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


const updatePageNotificationReadState = async (req, res, next) => {
  try {
    const userId = req.userId;
    const id = req.body.id;
    const readState = req.body.readState;

    console.log('req.body', req.body);

    const pageNotification = await PageNotification.findOne({ userId: userId });
    
    if (!pageNotification) {
      const error = new Error('pageNotification not found');
      error.statusCode = 404;
      throw error;
    }

    const pageNotificationList = pageNotification.pageNotificationList;
     
    console.log('pageNotificationList', pageNotificationList)
    const idElementIndex = pageNotificationList.findIndex(element => {
      return element._id.toString() === id;
    });

    // console.log('idElementIndex', idElementIndex)

    if (idElementIndex >= 0) {
      pageNotificationList[idElementIndex].readState = readState;
      pageNotificationList[idElementIndex].readTime = Date.now();
      
      pageNotification.pageNotificationList = pageNotificationList;
      await pageNotification.save();
    }

    res.status(200).json({ 
      message: "update page notification Read state success",
      data: pageNotification, 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


const addPageNotificationDataForTalkGroup = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      storeUserId,
      page,
      title,
      message,
      dataForNotification,
     } = req.body;


    const pageNotification = await PageNotification.findOne({ userId: storeUserId });
    
    if (!pageNotification) {
      const error = new Error('pageNotification not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedPageNotification = await storePageNotificationData(
      storeUserId,
      title,
      message,
      null,
      dataForNotification,
      page,
    );

    res.status(200).json({ 
      message: `add page notification data for ${page} success`,
      // data: updatedPageNotification, 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


const getPageNotificationCreatorUserNameDataList = async (req, res, next) => {
  try {

    const pageNotification = await PageNotification.findOne({ userId: req.userId });
    
    if (!pageNotification) {
      const error = new Error('pageNotification not found');
      error.statusCode = 404;
      throw error;
    };

    const usersForNameData = [];

    for (const notify of pageNotification.pageNotificationList) {
      const dataForNotification = notify.dataForNotification;

      if (notify.page === 'feed') {
        if (dataForNotification.postCreatorId) {
          usersForNameData.push({
            userId: dataForNotification.postCreatorId,
            name: dataForNotification.postCreatorName,
          })
        }

        if (dataForNotification.commentCreatorId) {
          usersForNameData.push({
            userId: dataForNotification.commentCreatorId,
            name: dataForNotification.commentCreatorName,
          })
        }

      }

      if (notify.page === 'talk') {
        if (dataForNotification.fromUserId) {
          usersForNameData.push({
            userId: dataForNotification.fromUserId,
            name: dataForNotification.fromName,
          })
        }
      }

      if (notify.page === 'group') {
        if (dataForNotification.fromUserId) {
          usersForNameData.push({
            userId: dataForNotification.fromUserId,
            name: dataForNotification.fromName,
          })
        }
      }
    }

    const uniqList = _.uniqBy(usersForNameData, ['userId']);

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    
    const userNameDataList = await getUserNameDataList(
        token,
        uniqList,
      );

    res.status(200).json({ 
      message: "get PageNotification Creator UserNameDataList success",
      data: userNameDataList, 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


module.exports = {
  getPageNotification,
  updatePageNotificationLastOpenTime,
  updatePageNotificationReadState,
  addPageNotificationDataForTalkGroup,
  getPageNotificationCreatorUserNameDataList,
};