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

const io = require("../../socket");
const Post = require("../../models/feed/post.js");
const User = require("../../models/user/user");
const Comment = require("../../models/feed/comment");
const PostVisit = require("../../models/feed/post-visit");
const PostUserVisit = require('../../models/feed/post-user-visit');
const FavoritePost = require("../../models/feed/favarite-post");
const UserRecentVisit = require("../../models/user/user-recent-visit");

const imageModify = require("../../util/image");
const { s3Upload, s3DeleteOne, s3DeleteMany } = require("../../util/image");
const { testAuth } = require("../../util/auth");
const { clearImage } = require("../../util/file");

// const { getUserSuggestPosts } = require('./feed-filter');
const { getUserSuggestPosts } = require('./feed-filter-suggest');
const { getUserNameDataListByUserIds } = require('../../util/user-name-data/user-name-data-util.js');

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
  // io.getIO().emit("posts", { action: "action" });
  res.json({ message: "response from getPosts controllers for socket" });
};

const getPosts = async (req, res, next) => {
  console.log("req.query in getPosts", req.query);
  const currentPage = req.query.page || 1;
  const perPage = 20;
  const loadLimit = 10000;

  // let loadNumber = perPage + 1 + (currentPage - 1) * perPage;
  let loadNumber = perPage + 20 + (currentPage - 1) * perPage;

  if (loadNumber > loadLimit) {
    loadNumber = loadLimit;
  }

  let totalItems;
  let posts;

  // const allPosts = await Post.find()
  //     // .populate('creator')
  //     // .limit()
  //     .sort({ createdAt: -1 });

  // console.log('allPosts', allPosts);
  // console.log('allPosts num ', allPosts.length);


  if (req.query.userpost === "true" || req.query.userpost === "userPosts") {
    try {
      // totalItems = await Post.find().countDocuments()
      // posts = await Post.find()
      //     .populate('creator')
      //     .sort({ createdAt: -1 })
      //     // .skip((currentPage - 1) * perPage)
      //     // .limit(perPage);

      const decodedToken = testAuth(req, "", "");
      // console.log(decodedToken);

      if (!req.query.userId || decodedToken.userId !== req.query.userId) {
        const error = new Error("not authorized!");
        error.statusCode = 403;
        throw error;
      }

      let userPosts = await Post.find({ creatorId: req.query.userId })
        // .populate('creator')
        .sort({ createdAt: -1 });

      userPosts = createReturnPosts(userPosts);

      // const userPosts = uPosts.filter(post => post.creatorId.toString() === req.query.userId);
      totalItems = userPosts.length;
      // console.log('userPosts: ',userPosts);
      console.log("userPosts totalItems", totalItems);

      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: userPosts,
        totalItems: totalItems,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    try {
      // totalItems = await Post.find().countDocuments()

      let suggestPosts = await getUserSuggestPosts(req, loadNumber);
      // console.log('sPosts', sPosts);
      console.log('suggestPosts.length', suggestPosts.length);

      suggestPosts = createReturnPosts(suggestPosts);

      // let publicOrUserPosts = await Post.find({
      //   $or: [{ public: "public" }, { creatorId: req.query.userId }],
      // })
      //   .sort({ createdAt: -1 })
      //   // .skip((currentPage - 1) * perPage)
      //   .limit(loadNumber);
      // // .limit(10);  // restrict get number
      // // .populate('creator')

 
      // totalItems = publicOrUserPosts.length;
      // console.log("publicOrUserPosts totalItems", totalItems);
      // // console.log('pOUPs: ', publicOrUserPosts, totalItems);

      // publicOrUserPosts = createReturnPosts(publicOrUserPosts);

      const userIdsForNameList = [];

      for (const post of suggestPosts) {
        userIdsForNameList.push(post.creatorId);
      }

      let userNameDataList = [];
      let token;
      const authHeader = req.get('Authorization');
      
      if (authHeader) {
        token = authHeader.split(' ')[1];
      }

      userNameDataList = await getUserNameDataListByUserIds(token, userIdsForNameList);

      // console.log(userNameDataList);
      res.status(200).json({
        message: "Fetched posts successfully.",
        // posts: publicOrUserPosts,
        posts: suggestPosts,
        totalItems: totalItems,
        userNameDataList: userNameDataList,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};

const createPost = async (req, res, next) => {
  console.log("req.body", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data incorrect.");
    error.statusCode = 422;
    throw error;
  }

  // if (!req.file) {
  //     res.status(422).json({ message: 'file is unacceptable file type or not exits' });
  //     // const error = new Error('No image provided');
  //     // error.statusCode = 422;
  //     // throw error;
  // }

  // console.log(req.file);

  const title = req.body.title;
  const content = req.body.content;
  const b64Simage = req.body.b64Simage;
  const public = req.body.public;
  const language = req.headers["accept-language"];
  const headers = req.headers;
  const location = JSON.parse(req.query.userLocation);
  // console.log('LOCATION', location);

  let creator;

  let imageUrl;

  if (!req.file) {
    imageUrl = "undefined";
  } else {
    imageUrl = req.file.path;
  }
  // const imageUrl = req.file.path;

  let modifiedImageUrl = "undefined";
  let thumbnailImageUrl;

  const savePost = async () => {
    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });

    // console.log('req.userId', req.userId);
    // create post in db
    console.log(
      "imageUrl in savePost",
      imageUrl,
      modifiedImageUrl,
      thumbnailImageUrl
    );
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      imagePath: imageUrl,
      modifiedImageUrl: modifiedImageUrl,
      thumbnailImageUrl: thumbnailImageUrl,
      // creator: req.userId,
      // creatorId: req.userId,
      creatorId: req.userId,
      creator_id: user._id.toString(),
      creatorName: user.name,
      creatorImageUrl: user.imageUrl,
      b64Simage: b64Simage,
      public: public,
      language: language,
      geolocation: location,
      headers: headers,
    });
    try {
      await post.save();
      // const user = await User.findById(req.userId);
      // user.posts.push(post);
      // await user.save()

      // io.getIO().emit("posts", {
      //   action: "create",
      //   post: {
      //     ...post._doc,
      //     // creator: {
      //     //     // _id: req.userId,
      //     //     _id: user._id,
      //     //     userId: req.userId,
      //     //     name: user.name
      //     // }
      //   },
      // });
      res.status(201).json({
        message: "Post created Successfully",
        post: post,
        // creator: {
        //     _id: user._id,
        //     userId: req.userId,
        //     name: user.name
        // }
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  if (imageUrl !== "undefined") {
    modifiedImageUrl = imageModify.makeModifiedUrl(imageUrl);
    console.log(modifiedImageUrl);

    const ForFile = imageUrl.split("/")[1];
    const ForFileArray = ForFile.split(".");
    const forFileFileType = ForFileArray.pop();
    const forFileWithoutFileType = ForFileArray.join("");
    const forFileFileName = forFileWithoutFileType + ".jpeg";
    // thumbnailImageUrl = 'images/' + forFileFileName;

    const fileMimetype = req.file.mimetype.split("/")[0];
    if (fileMimetype === "image") {
      const smallImage = await createSmallImage(imageUrl, modifiedImageUrl);
    }
    if (fileMimetype === "video") {
      thumbnailImageUrl = "images/" + forFileFileName;
      const trimedVideo = await trimVideo(imageUrl, modifiedImageUrl);
      const thumbnail = await createThumbnail(imageUrl, forFileFileName);
    }

    var params = {
      ACL: "private",
      // ACL: 'public-read',
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Body: fs.createReadStream(req.file.path),
      //   ContentType: 'image/jpeg',
      // Key: `images/${req.file.originalname}`
      Key: `${req.file.path}`,
    };

    var paramsModify = {
      ACL: "private",
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Body: fs.createReadStream(modifiedImageUrl),
      //   ContentType: 'image/jpeg',
      Key: `${modifiedImageUrl}`,
    };

    if (thumbnailImageUrl) {
      var paramsThumb = {
        ACL: "private",
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Body: fs.createReadStream(thumbnailImageUrl),
        //   ContentType: 'image/jpeg',
        Key: `${thumbnailImageUrl}`,
      };
    }

    if (fileMimetype === "image") {
      await s3Upload(params);
      await s3Upload(paramsModify);
      clearImage(req.file.path);
      clearImage(modifiedImageUrl);
      savePost();
    }
    if (fileMimetype === "video") {
      await s3Upload(params);
      await s3Upload(paramsModify);
      await s3Upload(paramsThumb);
      clearImage(req.file.path);
      clearImage(modifiedImageUrl);
      clearImage(thumbnailImageUrl);
      savePost();
    }
  } else {
    savePost();
  }
};

const getPost = async (req, res, next) => {
  try {

    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
    //   console.log("post not found");
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }

    // console.log('req.body', req.body);
    // console.log('req.query getPost', req.query);

    let doUrl;
    if (
      post.imageUrl &&
      post.imageUrl !== "undefined" &&
      post.imageUrl !== "deleted"
    ) {
      doUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: `${post.imageUrl}`,
        Expires: 60 * 60,
      });
    }
    // console.log('doUrl', doUrl);

    const decodedToken = testAuth(req, "", "");
    // console.log('decodedToken', decodedToken);
    // if (decodedToken.userId !== post.creatorId) {
    //     console.log(decodedToken.userId, post.creatorId, 'user is different');
    // } else {
    //     console.log(decodedToken.userId, post.creatorId, 'same user');
    // }

    // if (post.public === 'public' || post.creatorId.toString() === req.query.userId) {
    if (
      post.public === "public" ||
      (decodedToken && decodedToken.userId === post.creatorId)
    ) {
      const port = process.env.PORT || 8083;


      const returnPost = createReturnPost(post);
      // console.log(returnPost);
      res.status(200).json({
        message: "Post fetched.",
        post: returnPost,
      });
    } else {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
    //   res.status(403).json({ message: "Not Authorized" });
    }


  //// store post visit info in public post
  if (post && post.public === "public") {
    post.totalVisit = post.totalVisit + 1;
    await post.save();

    let postVisit = await PostVisit.findOne({ postId: postId });
    // console.log('POSTVISIT', postVisit);

    if (!postVisit) {
      postVisit = new PostVisit({
        postId: post._id.toString(),
        visit: null,
      });
      await postVisit.save();
    }

    const acceptLanguageList = postVisit.visit.acceptLanguage;
    const index = acceptLanguageList.findIndex((element) => {
      return element.name === req.headers["accept-language"].split(",")[0];
    });
    // console.log('INDEX of NAME', index);
    if (index > -1) {
      acceptLanguageList[index].number = acceptLanguageList[index].number + 1;
    } else {
      acceptLanguageList.push({
        name: req.headers["accept-language"].split(",")[0],
        number: 1,
      });
    }

    const userId = req.query.userId;
    // const userId = req.userId;
    const location = JSON.parse(req.query.userLocation);

    if (userId) {
      // const user = await User.findById(userId);
      postVisit.visit.details.push({
        userId: userId,
        geolocation: location,
        headers: req.headers,
      });
    } else {
      postVisit.visit.details.push({
        userId: "",
        geolocation: location,
        headers: req.headers,
      });
    }

    await postVisit.save();
    // console.log('updated post', post);

    //// store postUserVisit
    if (userId && userId !== 'null') {
      // console.log('req.headers', req.headers);
      const postUserVisit = new PostUserVisit({
        postId: post._id.toString(),
        userId: userId, 
        language: req.headers["accept-language"].split(",")[0],
        userAgent: req.headers["user-agent"],
        geolocation: location,
        time: Date.now(),
      });
      await postUserVisit.save();
    }
  


    //// store in userRecentVisit
    if (userId && userId !== 'null' && userId !== post.creatorId) {

      const addData = { 
        postId: post._id.toString(),
        creatorId: post.creatorId,
        time: Date.now(),
      };

      // console.log('addData', addData);
      const userRecentVisit = await UserRecentVisit.findOne({ userId: userId });

      if (!userRecentVisit) {
        const newRecentVisit = new UserRecentVisit({
          userId: userId,
          recentVisitPostIds: [addData],
          recentVisitGroupIds: [],
          recentVisitTalkUserIds: [],
        });

        await newRecentVisit.save();
      } else {
        const postVisits = userRecentVisit.recentVisitPostIds;
        let addedList = postVisits.concat(addData);

        if (addedList.length > 1000) {
          addedList = addedList.slice(-1000);
        }

        userRecentVisit.recentVisitPostIds = addedList;
        await userRecentVisit.save();
      }
    }


  }

} catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  console.log("req.body", req.body, "req.file", req.file);

  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const user = await User.findById(req.userId);

  const post = await Post.findById(postId).populate("creator");

  if (!post) {
    const error = new Error("Could not find post.");
    error.statusCode = 404;
    throw error;
  }
  if (post.creatorId.toString() !== req.userId) {
    const error = new Error("not authorized!");
    error.statusCode = 403;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const b64Simage = req.body.b64Simage;
  const public = req.body.public;
  const language = req.headers["accept-language"];
  // const geolocation = user.geolocation;
  const location = JSON.parse(req.query.userLocation);
  // console.log('LOCATION', location);
  const headers = req.headers;

  // let imageUrl = 'undefined';
  let imageUrl;
  let modifiedImageUrl;
  let thumbnailImageUrl;

  imageUrl = req.body.image;
  if (!req.body.image) {
    imageUrl = "undefined";
  }
  console.log("imageUrl", imageUrl);

  let fileMimetype;

  if (req.file) {
    imageUrl = req.file.path;
    console.log("imageUrl", imageUrl);
    fileMimetype = req.file.mimetype.split("/")[0];

    modifiedImageUrl = imageModify.makeModifiedUrl(imageUrl);
    console.log("modifiedImageUrl ", modifiedImageUrl);

    // console.log('imageUrl for filename ',imageUrl);
    const ForFile = imageUrl.split("/")[1];
    const ForFileArray = ForFile.split(".");
    const forFileFileType = ForFileArray.pop();
    const forFileWithoutFileType = ForFileArray.join("");
    const forFileFileName = forFileWithoutFileType + ".jpeg";
    // thumbnailImageUrl = 'images/' + forFileFileName;
    // console.log('filename without type? ', forFileWithoutFileType);

    if (fileMimetype === "image") {
      const smallImage = await createSmallImage(imageUrl, modifiedImageUrl);
    }
    if (fileMimetype === "video") {
      thumbnailImageUrl = "images/" + forFileFileName;
      const trimedVideo = await trimVideo(imageUrl, modifiedImageUrl);
      const thumbnail = await createThumbnail(imageUrl, forFileFileName);
    }

    var params = {
      ACL: "private",
      // ACL: 'public-read',
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Body: fs.createReadStream(req.file.path),
      //   ContentType: 'image/jpeg',
      // Key: `images/${req.file.originalname}`
      Key: `${req.file.path}`,
    };

    var paramsModify = {
      ACL: "private",
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Body: fs.createReadStream(modifiedImageUrl),
      //   ContentType: 'image/jpeg',
      Key: `${modifiedImageUrl}`,
    };

    if (thumbnailImageUrl) {
      var paramsThumb = {
        ACL: "private",
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Body: fs.createReadStream(thumbnailImageUrl),
        //   ContentType: 'image/jpeg',
        Key: `${thumbnailImageUrl}`,
      };
    }

    await s3Upload(params);

    if (fileMimetype === "image") {
      await s3Upload(paramsModify);
      clearImage(req.file.path);
      clearImage(modifiedImageUrl);
    }

    if (fileMimetype === "video") {
      await s3Upload(paramsModify);
      await s3Upload(paramsThumb);
      clearImage(req.file.path);
      clearImage(modifiedImageUrl);
      clearImage(thumbnailImageUrl);
    }

    if (
      imageUrl !== post.imageUrl &&
      post.imageUrl !== "undefined" &&
      post.imageUrl !== "deleted"
    ) {
      const deleteParams = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Delete: {
          Objects: [{ Key: post.imageUrl }, { Key: post.modifiedImageUrl }],
          // Quiet: false
        },
      };

      await s3DeleteMany(deleteParams);

      if (post.thumbnailImageUrl) {
        const deleteThumbParams = {
          Bucket: process.env.DO_SPACE_BUCKET_NAME,
          Key: post.thumbnailImageUrl,
        };

        await s3DeleteOne(deleteThumbParams);
      }
    }
  } else {
    // if (post.imageUrl) {
    //     imageUrl = post.imageUrl;
    // }
    if (post.modifiedImageUrl) {
      modifiedImageUrl = post.modifiedImageUrl;
    }
    if (post.thumbnailImageUrl) {
      thumbnailImageUrl = post.thumbnailImageUrl;
    }
  }

  try {
    // console.log('imageUrls', imageUrl, post.imageUrl);
    post.title = title;
    post.imageUrl = imageUrl;
    post.imagePath = imageUrl;
    post.content = content;
    post.b64Simage = b64Simage;
    post.public = public;
    post.language = language;
    post.geolocation = location;
    post.headers = headers;
    post.modifiedImageUrl = modifiedImageUrl;
    post.thumbnailImageUrl = thumbnailImageUrl;

    // const updateTime = Date.now();
    // post.lastUpdateTime = updateTime;
    // if (!post.updateTimes) {
    //     post.updateTimes = [];
    // }
    // post.updateTimes.push(updateTime);

    const result = await post.save();

    // io.getIO().emit("posts", { action: "update", post: result });
    res.status(200).json({ message: "Post updated", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  // try {
  const post = await Post.findById(postId);

  // check login user
  if (!post) {
    const error = new Error("Could not find post.");
    error.statusCode = 404;
    throw error;
  }
  if (post.creatorId.toString() !== req.userId) {
    const error = new Error("not authorized!");
    error.statusCode = 403;
    throw error;
  }

  // console.log('post.imageUrl', post.imageUrl);
  // console.log(post.imageUrl.split(process.env.DO_SPACE_ENDPOINT));

  if (
    post.imageUrl &&
    post.imageUrl !== "undefined" &&
    post.imageUrl !== "deleted"
  ) {
    const imageUrlArray = post.imageUrl.split(".");
    const fileType = imageUrlArray.pop().toLowerCase();

    // clearImage(post.imageUrl);
    // clearImage(post.modifiedImageUrl);
    // if (fileType === 'mp4' || fileType === 'webm') {
    //     clearImage(post.thumbnailImageUrl);
    // }
    // let deleteImageUrl = 'dummy';
    // let deleteModifiedImageUrl = 'dummy';
    // let deleteThumbnailImageUrl = 'dummy';
    // if (post.imageUrl) {
    //     deleteImageUrl = post.imageUrl.split(process.env.DO_SPACE_ENDPOINT)[1];
    // }
    // if (post.modifiedImageUrl) {
    //     deleteModifiedImageUrl = post.modifiedImageUrl.split(process.env.DO_SPACE_ENDPOINT)[1];
    // }
    // if (post.thumbnailImageUrl) {
    //     deleteThumbnailImageUrl = post.thumbnailImageUrl.split(process.env.DO_SPACE_ENDPOINT)[1];
    // }
    // console.log('deleteImageUrl', deleteImageUrl);

    const params = {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Delete: {
        Objects: [{ Key: post.imageUrl }, { Key: post.modifiedImageUrl }],
        // Quiet: false
      },
    };

    await s3DeleteMany(params);

    if (fileType === "mp4" || fileType === "webm") {
      const thumbParam = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: post.thumbnailImageUrl,
      };
      await s3DeleteOne(thumbParam);
    }
  }

  try {
    await Post.findByIdAndRemove(postId);

    await Comment.deleteMany({ postId: postId });
    await PostVisit.deleteOne({ postId: postId });

    ////delete favorite post
    await FavoritePost.deleteMany({ postId: postId });

    // io.getIO().emit("posts", { action: "delete", post: postId });

    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deletePostImage = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    // check login user
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creatorId.toString() !== req.userId) {
      const error = new Error("not authorized!");
      error.statusCode = 403;
      throw error;
    }

    if (
      !post.imageUrl ||
      post.imageUrl === "undefined" ||
      post.imageUrl === "deleted"
    ) {
      const error = new Error("Could not find image.");
      error.statusCode = 404;
      throw error;
    }

    const imageUrlArray = post.imageUrl.split(".");
    const fileType = imageUrlArray.pop().toLowerCase();

    console.log("fileType", fileType);

    // clearImage(post.imageUrl);
    // clearImage(post.modifiedImageUrl);

    // if (fileType === 'mp4' || fileType === 'webm') {
    //     clearImage(post.thumbnailImageUrl);
    // }

    const params = {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Delete: {
        Objects: [{ Key: post.imageUrl }, { Key: post.modifiedImageUrl }],
        // Quiet: false
      },
    };

    await s3DeleteMany(params);

    if (fileType === "mp4" || fileType === "webm") {
      const thumbDeleteParams = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: post.thumbnailImageUrl,
      };
      await s3DeleteOne(thumbDeleteParams);
    }

    post.imageUrl = "deleted";
    post.imagePath = "deleted";
    post.modifiedImageUrl = "deleted";
    if (post.thumbnailImageUrl) {
      post.thumbnailImageUrl = "deleted";
    }

    await post.save();

    // io.getIO().emit("posts", { action: "delete", post: postId });

    res
      .status(200)
      .json({ message: "Deleted post.", data: { deletePostImage: true } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getPostForMap = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  console.log("req.body", req.body);
  // console.log('req.query', req.query);

  // const decodedToken = testAuth(req, res, next);

  // if (decodedToken.userId !== post.creatorId) {

  //     console.log(decodedToken.userId, post.creatorId, 'user is different');
  // }

  let doUrl;
  if (
    post.imageUrl &&
    post.imageUrl !== "undefined" &&
    post.imageUrl !== "deleted"
  ) {
    doUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Key: `${post.imageUrl}`,
      Expires: 60 * 60,
    });
  }
  // console.log('doUrl', doUrl);

  // console.log('req.query', req.query, post.creatorId);
  if (
    post.public === "public" ||
    post.creatorId.toString() === req.query.userId
  ) {
    try {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post fetched.",
        post: {
          ...post._doc,
          imageUrl: doUrl ? doUrl : post.imageUrl,

          modifiedImageUrl:
            post.modifiedImageUrl &&
            post.imageUrl &&
            post.imageUrl !== "undefined" &&
            post.imageUrl !== "deleted"
              ? s3.getSignedUrl("getObject", {
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Key: post.modifiedImageUrl,
                  Expires: 60 * 60,
                  // Expires: 10
                })
              : undefined,
          thumbnailImageUrl:
            post.thumbnailImageUrl &&
            post.imageUrl &&
            post.imageUrl !== "undefined" &&
            post.imageUrl !== "deleted"
              ? s3.getSignedUrl("getObject", {
                  Bucket: process.env.DO_SPACE_BUCKET_NAME,
                  Key: post.thumbnailImageUrl,
                  Expires: 60 * 60,
                })
              : undefined,

          // creatorImageUrl: post.creatorImageUrl
          // ? s3.getSignedUrl('getObject', {
          //   Bucket: process.env.DO_SPACE_BUCKET_NAME,
          //   Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
          //   Expires: 60 * 60
          // })
          // : null
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    res.status(403).json({ message: "Not Authorized" });
  }
};


const getUserPublicPosts = async (req, res, next) => {
  try {
    console.log("req.query", req.query);
    const userId = req.query.userId;

    if (!userId) {
      const error = new Error("userId is required");
      error.statusCode = 400;
      throw error;
    }

    let userPosts = await Post.find({ 
      creatorId: userId,
      public: 'public'
     })
    .sort({ createdAt: -1 });

    if (userPosts.length === 0) {
      const error = new Error("user public posts not found");
      error.statusCode = 404;
      throw error;
    }

    userPosts = createReturnPosts(userPosts);

    // const userPosts = uPosts.filter(post => post.creatorId.toString() === req.query.userId);
    totalItems = userPosts.length;
    // console.log('userPosts: ',userPosts);
    console.log("userPosts totalItems", totalItems);

    res.status(200).json({
      message: "Get user public posts Successfully",
      posts: userPosts,
    });
    
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// const clearImage = filePath => {
//     console.log('clearimage', filePath);
//     filePath = path.join(__dirname, '..', filePath);
//     fs.unlink(filePath, err => console.log(err));
//     // console.log('Image Deleted, filePath: ', filePath );
// }


const createReturnPost = (post) => {

  let doUrl;
  if (
    post.imageUrl &&
    post.imageUrl !== "undefined" &&
    post.imageUrl !== "deleted"
  ) {
    doUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.DO_SPACE_BUCKET_NAME,
      Key: `${post.imageUrl}`,
      Expires: 60 * 60,
    });
  }
  
  const port = process.env.PORT || 8083;

      const imageUrls = [];
      if (post.imageUrls && post.imageUrls.length > 0) {
        if (!process.env.S3NOTUSE) {
          for (const imageUrl of post.imageUrls) {
            imageUrls.push(
              s3.getSignedUrl("getObject", {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: imageUrl,
                Expires: 60 * 60 * 24 * 365,
              })
            );
          }
        }
        if (process.env.S3NOTUSE) {
          for (const imageUrl of post.imageUrls) {
            imageUrls.push(`http://localhost:${port}/${imageUrl}`);
          }
        }
      }

      const modifiedImageUrls = [];
      if (post.modifiedImageUrls && post.modifiedImageUrls.length > 0) {
        if (!process.env.S3NOTUSE) {
          for (const imageUrl of post.modifiedImageUrls) {
            modifiedImageUrls.push(
              s3.getSignedUrl("getObject", {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: imageUrl,
                Expires: 60 * 60 * 24 * 365,
              })
            );
          }
        }
        if (process.env.S3NOTUSE) {
          for (const imageUrl of post.modifiedImageUrls) {
            modifiedImageUrls.push(`http://localhost:${port}/${imageUrl}`);
          }
        }
      }

      const thumbnailImageUrls = [];
      if (post.thumbnailImageUrls && post.thumbnailImageUrls.length > 0) {
        if (!process.env.S3NOTUSE) {
          for (const imageUrl of post.thumbnailImageUrls) {
            thumbnailImageUrls.push(
              s3.getSignedUrl("getObject", {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: imageUrl,
                Expires: 60 * 60 * 24 * 365,
              })
            );
          }
        }
        if (process.env.S3NOTUSE) {
          for (const imageUrl of post.thumbnailImageUrls) {
            thumbnailImageUrls.push(`http://localhost:${port}/${imageUrl}`);
          }
        }
      }

      let creatorImageUrl = null;
      if (!process.env.S3NOTUSE && post.creatorImageUrl) {
        creatorImageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.DO_SPACE_BUCKET_NAME,
          Key: post.creatorImageUrl ? post.creatorImageUrl : "dummy-key",
          Expires: 60 * 60 * 24 * 365,
        });
      }

      if (process.env.S3NOTUSE && post.creatorImageUrl) {
        creatorImageUrl = `http://localhost:${port}/${post.creatorImageUrl}`;
      }

      return {
        ...post._doc,
        imageUrl: doUrl ? doUrl : post.imageUrl,

        modifiedImageUrl:
          post.modifiedImageUrl &&
          post.imageUrl &&
          post.imageUrl !== "undefined" &&
          post.imageUrl !== "deleted"
            ? s3.getSignedUrl("getObject", {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.modifiedImageUrl,
                Expires: 60 * 60 * 24 * 365,
                // Expires: 10
              })
            : undefined,
        thumbnailImageUrl:
          post.thumbnailImageUrl &&
          post.imageUrl &&
          post.imageUrl !== "undefined" &&
          post.imageUrl !== "deleted"
            ? s3.getSignedUrl("getObject", {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.thumbnailImageUrl,
                Expires: 60 * 60 * 24 * 365,
              })
            : undefined,

        // creatorImageUrl: post.creatorImageUrl
        // ? s3.getSignedUrl('getObject', {
        //   Bucket: process.env.DO_SPACE_BUCKET_NAME,
        //   Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
        //   Expires: 60 * 60
        // })
        // : null,
        creatorImageUrl: creatorImageUrl,

        imageUrls: imageUrls,
        modifiedImageUrls: modifiedImageUrls,
        thumbnailImageUrls: thumbnailImageUrls,
      }
};


const createReturnPosts = (posts) => {
  return posts.map((post) => {
    // console.log(post);
    const port = process.env.PORT || 8083;

    const imageUrls = [];
    if (post.imageUrls && post.imageUrls.length > 0) {
      if (!process.env.S3NOTUSE) {
        for (const imageUrl of post.imageUrls) {
          imageUrls.push(
            s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: imageUrl,
              Expires: 60 * 60 * 24 * 365,
            })
          );
        }
      }
      if (process.env.S3NOTUSE) {
        for (const imageUrl of post.imageUrls) {
          imageUrls.push(`http://localhost:${port}/${imageUrl}`);
        }
      }
    }

    const modifiedImageUrls = [];
    if (post.modifiedImageUrls && post.modifiedImageUrls.length > 0) {
      if (!process.env.S3NOTUSE) {
        for (const imageUrl of post.modifiedImageUrls) {
          modifiedImageUrls.push(
            s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: imageUrl,
              Expires: 60 * 60 * 24 * 365,
            })
          );
        }
      }
      if (process.env.S3NOTUSE) {
        for (const imageUrl of post.modifiedImageUrls) {
          modifiedImageUrls.push(`http://localhost:${port}/${imageUrl}`);
        }
      }
    }

    const thumbnailImageUrls = [];
    if (post.thumbnailImageUrls && post.thumbnailImageUrls.length > 0) {
      if (!process.env.S3NOTUSE) {
        for (const imageUrl of post.thumbnailImageUrls) {
          thumbnailImageUrls.push(
            s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: imageUrl,
              Expires: 60 * 60 * 24 * 365,
            })
          );
        }
      }
      if (process.env.S3NOTUSE) {
        for (const imageUrl of post.thumbnailImageUrls) {
          thumbnailImageUrls.push(`http://localhost:${port}/${imageUrl}`);
        }
      }
    }

    let creatorImageUrl = null;
    if (!process.env.S3NOTUSE && post.creatorImageUrl) {
      creatorImageUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: post.creatorImageUrl ? post.creatorImageUrl : "dummy-key",
        Expires: 60 * 60 * 24 * 365,
      });
    }

    if (process.env.S3NOTUSE && post.creatorImageUrl) {
      creatorImageUrl = `http://localhost:${port}/${post.creatorImageUrl}`;
    }

    return {
      ...post._doc,
      imagePath: post.imageUrl,
      imageUrl:
        post.imageUrl &&
        post.imageUrl !== "undefined" &&
        post.imageUrl !== "deleted"
          ? s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: post.imageUrl,
              Expires: 60 * 60 * 24 * 365,
            })
          : "undefined",
      modifiedImageUrl:
        post.modifiedImageUrl &&
        post.imageUrl &&
        post.imageUrl !== "undefined" &&
        post.imageUrl !== "deleted"
          ? s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: post.modifiedImageUrl,
              Expires: 60 * 60 * 24 * 365,
            })
          : undefined,
      thumbnailImageUrl:
        post.thumbnailImageUrl &&
        post.imageUrl &&
        post.imageUrl !== "undefined" &&
        post.imageUrl !== "deleted"
          ? s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: post.thumbnailImageUrl,
              Expires: 60 * 60 * 24 * 365,
            })
          : undefined,
      // creatorImageUrl: post.creatorImageUrl
      //     ? s3.getSignedUrl('getObject', {
      //         Bucket: process.env.DO_SPACE_BUCKET_NAME,
      //         Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
      //         Expires: 60 * 60
      //       })
      //     : null,
      creatorImageUrl: creatorImageUrl,
      imageUrls: imageUrls,
      modifiedImageUrls: modifiedImageUrls,
      thumbnailImageUrls: thumbnailImageUrls,
    };
  });
};



const createSmallImage = (imageUrl, modifiedImageUrl) => {
  return new Promise((resolve, reject) => {
    gm(imageUrl)
      .resize(100, 100)
      // .noProfile()
      .write(modifiedImageUrl, function (err) {
        if (err) {
          console.log("error occured ", err);
          reject({ message: "error occured " + err });
        }
        if (!err) {
          console.log("done making small image");
          resolve({ message: "done making small image" });
          // console.log('done');
          // gm(modifiedImageUrl)
          //     .identify(function (err, data) {
          //         if (err) console.log(err);
          //         // if (!err) console.log('DATA:',data);

          //     });
        }
      });
  });
};

const trimVideo = (imageUrl, modifiedImageUrl) => {
  return new Promise((resolve, reject) => {
    ffmpeg(imageUrl)
      .setFfmpegPath(ffmpeg_static)
      .setStartTime("00:00:01") //Can be in "HH:MM:SS" format also
      .setDuration(3)
      .size("50x?")
      .autopad()
      .on("start", function (commandLine) {
        console.log("Spawned FFmpeg with command: " + commandLine);
      })
      .on("codecData", function (data) {
        console.log(
          "Input is " +
            data.audio_details +
            " AUDIO " +
            "WITH " +
            data.video_details +
            " VIDEO"
        );
      })
      .on("error", function (err) {
        console.log("error: ", err);
        reject({ message: "error occured " + err });
      })
      .on("end", function (err) {
        if (!err) {
          console.log("video trim conversion Done");
          resolve({ message: "video trim conversion Done" });
        }
      })
      .saveToFile(modifiedImageUrl);
  });
};

const createThumbnail = (imageUrl, filename) => {
  return new Promise((resolve, reject) => {
    ffmpeg(imageUrl)
      // setup event handlers
      // .on('filenames', function(filename) {
      //     console.log('screenshots are ' + filenames.join(', '));
      // })
      .on("end", function () {
        console.log("screenshots were saved");
        resolve({ message: "screenshots were saved" });
      })
      .on("error", function (err) {
        console.log("an error happened: " + err.message);
        reject({ message: "error occured " + err });
      })
      // take 2 screenshots at predefined timemarks and size
      .takeScreenshots(
        {
          count: 1,
          filename: filename,
          timemarks: ["50%"],
          size: "?x100",
        },
        "./images"
      );
  });
};

// var CreateSmallImage = gm(imageUrl)
//     .resize(50, 50)
//     // .noProfile()
//     .write(modifiedImageUrl, function (err) {
//         if (err) {console.log(err);}
//         if (!err) {
//             // console.log('done');
//             // gm(modifiedImageUrl)
//             //     .identify(function (err, data) {
//                 //         if (err) console.log(err);
//                 //         // if (!err) console.log('DATA:',data);

//                 //     });
//             }
//     });

// var trimVideo = ffmpeg(imageUrl)
//     .setFfmpegPath(ffmpeg_static)
//     .setStartTime('00:00:01') //Can be in "HH:MM:SS" format also
//     .setDuration(3)
//     .size("50x?").autopad()
//     .on("start", function(commandLine) {
//         console.log("Spawned FFmpeg with command: " + commandLine);
//     })
//     .on('codecData', function(data) {
//         console.log('Input is ' + data.audio_details + ' AUDIO ' +
//         'WITH ' + data.video_details + ' VIDEO');
//     })
//     .on("error", function(err) {
//         console.log("error: ", err);
//     })
//     .on("end", function(err) {
//         if (!err) {
//             console.log("conversion Done");
//         }
//     })
//     .saveToFile(modifiedImageUrl);

// gm(imageUrl)
//     .size(function (err, size) {
//         if (err) {
//             console.log(err);
//         }
//         if (!err) {
//             console.log('size', size);
//         console.log(size.width > size.height ? 'wider' : 'taller than you');
//     }
// });

// im.identify(imageUrl, function(err, features){
//     if (err) throw err;
//     console.log('features', features);
//   })

// const imageUrlArray = imageUrl.split('.');
// const fileType = imageUrlArray.pop();
// const withoutFileType = imageUrlArray.join('');
// const modifiedImageUrl = withoutFileType + '-modify.' + fileType
// console.log('imageUrl ft', fileType);
// console.log('img',withoutFileType);
// console.log('mod', modifiedImageUrl);

module.exports = {
  feedAction: feedAction,
  getPosts: getPosts,
  getPost: getPost,
  createPost: createPost,
  updatePost: updatePost,
  deletePost: deletePost,
  deletePostImage: deletePostImage,
  getUserPublicPosts: getUserPublicPosts,
  getPostForMap: getPostForMap,
  createReturnPost: createReturnPost,
  createReturnPosts: createReturnPosts,
}