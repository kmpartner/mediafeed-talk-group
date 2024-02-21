const PageNotification = require('../../models/page-notification/page-notification');
const FavoritePost = require('../../models/feed/favarite-post');
const FollowerTable = require('../../models/feed/follower-table');
const User = require('../../models/user/user');
const Comment = require('../../models/feed/comment');

const storePageNotificationData = async (
  userId,
  title, 
  message, 
  dbInfo, 
  dataForNotification,
  page,
) => {
  try {

    if (!userId || !title) {
      const error = new Error('userId and title are required');
      error.statusCode = 400;
      throw error;
    }

    let pageNotification = await PageNotification.findOne({ userId: userId });
    
    const nowTime = Date.now();

    const addContent = {
      creationTime: nowTime,
      title: title,
      message: message,
      dbInfo: dbInfo,
      // dbInfo: {
      //   dataId: null, //// _id of stored data if present
      //   schema: null,  //// ref for data from config
      // },
      dataForNotification: dataForNotification,  //// other additional info object ...
      page: page,
      // readState: '',
      // readTime: 0,
    };
    
    // console.log('addContent', addContent);
    // console.log('pageNotification', pageNotification);
  
    if (!pageNotification) {
      pageNotification = new PageNotification({
        userId: userId,
        lastOpenTime: nowTime - 1,  //// to display initial one
        pageNotificationList: [addContent],
      });
  
      await pageNotification.save();

    } else {
      const pageNotificationList = pageNotification.pageNotificationList;
      let addedList = pageNotificationList.concat(addContent);
      
      if (addedList.length > 200) {
        addedList = addedList.slice(-200);
      }
  
      pageNotification.pageNotificationList = addedList;
      await pageNotification.save();
    }
  
    return pageNotification;

  } catch(err) {
    console.log(err);
    // throw err;
  }
};


const addFeedPostPageNotification = async (userId, postData) => {
  try {
    if (postData.public !== 'public') {
      return;
    }

    if (postData.pageNotificationSend) {
      return;
    }
    
    let isImageFile = false;

    if (postData.imagePaths.length > 0) {
      isImageFile = true;
    }

    // const followData = await db.getDb().collection("follows").find({}).toArray();
    const favoritePostData = await FavoritePost.find({
      postId: postData._id
    });

    const followerTableData = await FollowerTable.find({
      followingUserId: userId
    });
  
    // return;
    const candidateIds = [];
  
    for (const element of favoritePostData) {
      if (element.userId !== userId) {
        candidateIds.push(element.userId);
      }
    }
  
    for (const element of followerTableData) {
      if (element.userId !== userId) {
        candidateIds.push(element.userId);
      }
    }
  
    // console.log('candidateIds', candidateIds);
  
    if (candidateIds.length === 0) {
      return;
    }
  
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
  
    var uniqueIds = candidateIds.filter(onlyUnique);
    // console.log('uniqueIds', uniqueIds);

    for (const storeUserId of uniqueIds) {
      const user = await User.findOne({ userId: storeUserId });

      if (user) {
        await storePageNotificationData(
          storeUserId,
          `New feed post by ${user.name}`,
          `${postData.title}`,
          null,
          { 
            postId: postData._id.toString(),
            isImageFile: isImageFile,
          },
          'feed',
        );
      }
    }

    postData.pageNotificationSend = true;
    await postData.save();

  }  catch (err) {
    console.log(err);
    // throw err;
  }
};



const addFeedPostCommentPageNotification = async (commentData, postCreatorId) => {
  try {

    const postId = commentData.postId;

    let modifyContent = commentData.content;
    if (commentData.content.length > 50) {
      modifyContent = commentData.content.slice(0,50) + '.....'
    } 

    if (commentData.creatorId === postCreatorId) {
      // console.log('commentData', commentData);
      const parentCommentId = commentData.parentCommentId;

      if (parentCommentId) {
        const parentComment = await Comment.findOne({_id: parentCommentId});
        // console.log('parentComment', parentComment);
        if (parentComment) {
          await storePageNotificationData(
            parentComment.creatorId,
            `New comment by ${commentData.creatorName}`,
            `${modifyContent}`,
            null,
            { 
              postId: postId,
              commentCreatorId: commentData.creatorId,
              commentId: commentData._id.toString(),
              // isImageFile: isImageFile,
            },
            'feed',
          );
        }
      }

      return;
    }

    await storePageNotificationData(
      postCreatorId,
      `New comment on your post by ${commentData.creatorName}`,
      `${modifyContent}`,
      null,
      { 
        postId: postId,
        commentCreatorId: commentData.creatorId,
        commentId: commentData._id.toString(),
        // isImageFile: isImageFile,
      },
      'feed',
    );

  }  catch (err) {
    console.log(err);
    // throw err;
  }
};


module.exports = {
  storePageNotificationData,
  addFeedPostPageNotification,
  addFeedPostCommentPageNotification,
}