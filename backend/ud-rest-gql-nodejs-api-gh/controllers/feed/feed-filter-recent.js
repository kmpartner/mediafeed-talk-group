const _ = require('lodash');

const aws = require("aws-sdk");
const jwt = require('jsonwebtoken');

const Post = require("../../models/feed/post.js");
const User = require('../../models/user/user');
const UserReactionType = require('../../models/feed/user-reaction-type');
const UserReaction = require('../../models/feed/user-reaction');
const FilteredPosts = require('../../models/feed/filtered-posts');
const UserRecentVisit = require('../../models/user/user-recent-visit');

const { createReturnPosts } = require('./feed');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
  secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
  region: process.env.DO_SPACE_REGION,
});
const s3 = new aws.S3();


const getRecentMostVisitLngPosts = async (req, res, next) => {
  try {
    const limit = 30;

    let language; 
    
    if (req.headers && req.headers['accept-language']) {
      language = req.headers['accept-language'].split(',')[0];
    }

    let returnList = [];

    const recentMostVisitLngPosts = await Post.find({
      language: language,
      public: "public",
      createdAt: { $gte: new Date((Date.now() - 1000*60*60*24*30)) }
    })
    // .sort({ createdAt: -1 })
    .sort({ totalVisit: -1 })
    .limit(limit);

    returnList = recentMostVisitLngPosts;

    // console.log('returnList.length1', returnList.length);

    if (returnList.length < 20) {
      const mostVisitLngPosts = await Post.find({
        language: language,
        public: "public",
      })
      // .sort({ createdAt: -1 })
      .sort({ totalVisit: -1 })
      .limit(limit);

      returnList = returnList.concat(mostVisitLngPosts);
      // console.log('returnList.length2', returnList.length);
      returnList = _.uniqBy(returnList, function (e) {
        return e._id.toString();
      });
      // console.log('returnList.length2', returnList.length);

      // for (const p of returnList) {
      //   console.log(p._id, p.title);
      // }

      if (returnList.length < 20) {
        const mostVisitPosts = await Post.find({
          public: "public",
        })
        // .sort({ createdAt: -1 })
        .sort({ totalVisit: -1 })
        .limit(limit);

        returnList = returnList.concat(mostVisitPosts);
        returnList = _.uniqBy(returnList, function (e) {
          return e._id.toString();
        });
        // console.log('returnList.length3', returnList.length);
      }
    }

    returnList = createReturnPosts(returnList);


    res.status(200).json({
      message: "Fetched recent most visit language posts success.",
      posts: returnList,
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



module.exports = {
  getRecentMostVisitLngPosts,
}