const _ = require('lodash');

const aws = require("aws-sdk");
const jwt = require('jsonwebtoken');

const Post = require("../../models/feed/post.js");
const User = require('../../models/user/user');
const UserReactionType = require('../../models/feed/user-reaction-type');
const UserReaction = require('../../models/feed/user-reaction');
const FilteredPosts = require('../../models/feed/filtered-posts');
const UserRecentVisit = require('../../models/user/user-recent-visit');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
  secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
  region: process.env.DO_SPACE_REGION,
});
const s3 = new aws.S3();



const getUserSuggestPosts = async (req, limit) => {
  try {
    console.log('limit', limit);

    let user;
    let returnPosts = [];
    let language; 
    
    if (req.headers && req.headers['accept-language']) {
      language = req.headers['accept-language'].split(',')[0];
    }

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];

    // function parseJwt (token) {
    //     return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    // }

    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };

    // console.log('token', authHeader, token);

    const parsedToken = parseJwt(token);

    if (parsedToken && parsedToken.userId) {
      user = await User.findOne({ userId: parsedToken.userId });
    }

    // console.log('user', user);

    if (user) {

      const visitUserPosts = await createVisitUserPosts(user.userId, limit);


      const followingUserIds = [];

      if (user.followingUserIds && user.followingUserIds.length > 0) {
        for (const id of user.followingUserIds) {
          followingUserIds.push(id.userId);
        }
      }

      console.log('followingUserIds', followingUserIds);

      const languagePosts = await Post.find({ 
        language : language, 
        public: "public",
        "creatorId": { "$ne": user.userId },
      })
      .sort({ createdAt: -1 })
      .limit(limit);

      // for (const post of languagePosts) {
      //   console.log('lngPosts, creatorId', post.creatorId, post.title);
      // }

      const followingUserPosts = await Post.find({
          'creatorId': { $in: followingUserIds },
          public: "public",
        })
        .sort({ createdAt: -1 })
        .limit(3);
      

      // returnPosts = followingUserPosts.concat(languagePosts);
      
      const randNum = Math.random();
      // console.log(randNum);

      if (randNum > 0.5) {
        returnPosts = followingUserPosts.concat(visitUserPosts).concat(languagePosts);
      }
      if (randNum > 0.15 && randNum <= 0.5) {
        returnPosts = visitUserPosts.concat(followingUserPosts).concat(languagePosts);
      }
      if (randNum <= 0.15) {
        returnPosts = languagePosts.concat(followingUserPosts).concat(visitUserPosts);
      }
      
      
      returnPosts = returnPosts.filter(post => {
        return post.creatorId !== parsedToken.userId;
      });
      
      // for (const post of returnPosts) {
      //   console.log('returnPosts creatorId', post.creatorId, post.creatorName, post._id);
      // }
      
      console.log('returnPosts, languagePosts followingUserPosts', returnPosts.length, languagePosts.length, followingUserPosts.length);
      // console.log(returnPosts);
    } 
    
    else {
      returnPosts = await Post.find({ 
        language : language,
        public: "public",
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      // console.log('returnPosts.length else', returnPosts.length);
    }

    // returnPosts = _.orderBy(returnPosts, 'createdAt', 'desc');


    const publicPosts = await Post.find({
      $or: [{ public: "public" }],
    })
      .sort({ createdAt: -1 })
      // .skip((currentPage - 1) * perPage)
      .limit(limit);
    

    returnPosts = returnPosts.concat(publicPosts);


    const uList = [];

    for (const element of returnPosts) {
      const isInList = uList.find(ele => {
        return ele._id.toString() === element._id.toString();
      });

      if (!isInList) {
        uList.push(element);
      }
    }

    console.log('returnPosts.length public', returnPosts.length, publicPosts.length);
    console.log('uList.length', uList.length);
    returnPosts = uList.slice(0, limit);
    // returnPosts = _.orderBy(trimedList, 'createdAt', 'desc');
    
    console.log('returnPosts.length after trim', returnPosts.length);

    return returnPosts;

  } catch (err) {
    console.log(err);
    return [];
    // if (!err.statusCode) {
    //   err.statusCode = 500;
    // }
    // next(err);
  }
};


const createVisitUserPosts = async (userId, limit) => {
  try {
    const visitIdsForSuggest = [];

    const userRecentVisit = await UserRecentVisit.findOne({ userId: userId });
  
    // console.log('userRecentVisit', userRecentVisit);
  
    if (userRecentVisit) {
      const userVisitPostIds = userRecentVisit.recentVisitPostIds;
      
      const userVisitGroupIds = userRecentVisit.recentVisitGroupIds;
      const userVisitTalkUserIds = userRecentVisit.recentVisitTalkUserIds;

      const combinedMap = userVisitPostIds
        .concat(userVisitGroupIds)
        .concat(userVisitTalkUserIds)
        .map(element => {
          // let type = 'post';
          // if (element.groupId) {
          //   type = 'group';
          // }
          // if (!element.groupId && !element.postId) {
          //   type = 'talk';
          // }

          return {
            userId: element.creatorId ? element.creatorId : element.userId,
            time: element.time,
            // type: type, 
          }
        });

      // console.log('combinedMap', combinedMap, combinedMap.length);
      // console.log('gIds, tIds', userVisitGroupIds, userVisitTalkUserIds);
      // console.log('userVisitPostIds last', userVisitPostIds[userVisitPostIds.length -1]);
      
      // const groupedBy = _.groupBy(userVisitPostIds, 'creatorId');
  
      // const gGroupedBy = _.groupBy(userVisitGroupIds, 'creatorId');
      // const tGroupedBy = _.groupBy(userVisitTalkUserIds, 'userId');
      
      const allGroupedBy = _.groupBy(combinedMap, 'userId');
      // console.log('gGroupedBy tGroupedBy', gGroupedBy, tGroupedBy);
      // console.log('allGroupedBy', allGroupedBy);
      // console.log('groupedBy', groupedBy);
      
      // // add last visit first
      let countList = [];

      if (userVisitPostIds.length > 0) {
        countList.push({
          userId: userVisitPostIds[userVisitPostIds.length -1].creatorId,
          count: 1000000,
        });
      }

      if (userVisitGroupIds.length > 0) {
        countList.push({
            userId: userVisitGroupIds[userVisitGroupIds.length -1].creatorId,
            count: 1000000,
        });
      }

      if (userVisitTalkUserIds.length > 0) {
        countList.push({
          userId: userVisitTalkUserIds[userVisitTalkUserIds.length -1].userId,
          count: 1000000,
        })
      }

      // for (const key in groupedBy) {
      //   countList.push({
      //     userId: key,
      //     count: groupedBy[key].length,
      //   })
      // }

      for (const key in allGroupedBy) {
        countList.push({
          userId: key,
          count: allGroupedBy[key].length,
        })
      }

      // console.log('countList before', countList);
      
      countList = _.uniqBy(countList, 'userId');
      countList = _.orderBy(countList, 'count', 'desc');

      // console.log('countList', countList);
  
      for (let i=0; i<9; i++) {
        if (countList[i]) {
          visitIdsForSuggest.push(countList[i].userId);
        }
      }
  
      console.log(visitIdsForSuggest);
    }
  
    let visitUserPosts = [];
  
    for (const vId of visitIdsForSuggest) {
      const vUserPosts = await Post.find({ 
        creatorId: vId,
        public: "public",
       })
       .sort({ createdAt: -1 })
       .limit(2);
  
      if (vUserPosts.length > 0) {
        visitUserPosts = visitUserPosts.concat(vUserPosts);
      }
  
    }
  
    visitUserPosts = _.orderBy(visitUserPosts, 'createdAt', 'desc');
  
    console.log('visitUserPosts', visitUserPosts.length);
  

    return visitUserPosts;
  
  } catch(err) {
    console.log(err);
    return [];
  }
};

module.exports = {
  getUserSuggestPosts: getUserSuggestPosts,
}