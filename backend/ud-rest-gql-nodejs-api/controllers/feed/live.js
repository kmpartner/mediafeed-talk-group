const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require("ffmpeg-static");
const probe = require("node-ffprobe");
const gm = require("gm");
var im = require("imagemagick");
var imageMagick = gm.subClass({ imageMagick: true });
var ObjectId = require("mongoose").Types.ObjectId;
const aws = require("aws-sdk");
const fetch = require('node-fetch');

const io = require("../../socket");
const Post = require("../../models/feed/post.js");
const User = require("../../models/user/user");
const Comment = require("../../models/feed/comment");
const PostVisit = require("../../models/feed/post-visit");
const PostUserVisit = require('../../models/feed/post-user-visit');
const FavoritePost = require("../../models/feed/favarite-post");
const imageModify = require("../../util/image");
const { s3Upload, s3DeleteOne, s3DeleteMany } = require("../../util/image");
const { testAuth } = require("../../util/auth");
const { clearImage } = require("../../util/file");
const { createReturnPost, createReturnPosts } = require('./feed');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
  secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
  region: process.env.DO_SPACE_REGION,
});
const s3 = new aws.S3();

const feedAction = async (req, res, next) => {
  // console.log(req.body);
  io.getIO().emit("posts", { action: "action" });
  res.json({ message: "response from getPosts controllers for socket" });
};


const getLivePost = async (req, res, next) => {
  try {
    console.log("req.query", req.query);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const liveRoomId = req.query.liveRoomId;
    const liveLocationPass = req.query.liveLocationPass;

    if (!liveRoomId || !liveLocationPass) {
      //   console.log("post not found");
        const error = new Error("liveRoomId and liveLocationPass are required.");
        error.statusCode = 400;
        throw error;
    }

    const edumeetWebinerBalckendUrl = process.env.EDUMEETWEBINER_BACKENDURL;

    const result = await fetch(edumeetWebinerBalckendUrl + `/room/check-room`, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify({
        roomId: liveRoomId,
        password: liveLocationPass,
        useLive: 'useLive',
      }),
    });

    if (result.status !== 200) {
      // return;
      const error = new Error("room not found");
      error.statusCode = 400;
      throw error;
    }

    const resData = await result.json();
    // console.log('resData', resData);

    let returnData;
    let liveInfo;

    if (resData.data) {

      if (!resData.data.useLive) {
        const error = new Error("live room not found");
        error.statusCode = 400;
        throw error;
      }

      liveInfo = {
        roomId: resData.data.roomId,
        start: resData.data.start,
        end: resData.data.end,
        allowBeforeStart: resData.data.allowBeforeStart,
      };

      const presenterUser = await User.findOne({
        email: resData.data.email,
      });
      // console.log('presenterUser', presenterUser);

      if (!presenterUser) {
        // return;
        const error = new Error("live presenter not exist");
        error.statusCode = 404;
        throw error;
      }

      if (presenterUser) {
        const livePost = await Post.findOne(({
          liveRoomId: liveRoomId,
          liveLocationPass: liveLocationPass,
          // livePresenterEmail: presenterUser.email,
        }));

        // console.log('livePost', livePost);
        const liveContent = `auto creation of private live post. When viewer accessed your live url, this post is created. 
          live start time: ${new Date(resData.data.start).toUTCString()} UTC time, live end time: ${new Date(resData.data.end).toUTCString()} UTC time`;
        
        if (!livePost) {
          //// create live post
          const newLivePost = new Post({
            title: 'auto created private live post',
            content: 'auto created private live post',
            imageUrl: '',
            imagePath: '',
            modifiedImageUrl: '',
            thumbnailImageUrl: '',
            // creator: req.userId,
            // creatorId: req.userId,
            creatorId: presenterUser.userId,
            // creator_id: user._id.toString(),
            // creatorName: user.name,
            // creatorImageUrl: user.imageUrl,
            // b64Simage: b64Simage,
            public: 'private',
            // language: language,
            // geolocation: location,
            // headers: headers,
            postType: 'live',
            liveRoomId: liveRoomId,
            liveLocationPass: liveLocationPass,
            // livePresenterEmail: presenterUser.email,
          });

          await newLivePost.save();

          returnData = newLivePost;
        } else {
          returnData = livePost;
        }
      }
    }


    res.status(200).json({
      message: "Get Live post Successfully",
      livePost: returnData,
      liveInfo: liveInfo,
    });
    
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


const getPresenterPosts = async (req, res, next) => {
  try {
    console.log("req.query", req.query);

    let userPosts = await Post.find({ 
      creatorId: req.query.userId,
      public: 'public'
     })
    .sort({ createdAt: -1 });

    if (userPosts.length === 0) {
      const error = new Error("presenter posts not found");
      error.statusCode = 404;
      throw error;
    }

    userPosts = createReturnPosts(userPosts);

    // const userPosts = uPosts.filter(post => post.creatorId.toString() === req.query.userId);
    totalItems = userPosts.length;
    // console.log('userPosts: ',userPosts);
    console.log("userPosts totalItems", totalItems);

    res.status(200).json({
      message: "Get Live presenter posts Successfully",
      posts: userPosts,
    });
    
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


module.exports = {
  // feedAction: feedAction,
  // getPosts: getPosts,
  // createLivePost: createLivePost,
  getLivePost: getLivePost,
  getPresenterPosts: getPresenterPosts
}