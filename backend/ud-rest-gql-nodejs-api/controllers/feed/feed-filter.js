const gm = require("gm");
var im = require("imagemagick");
var imageMagick = gm.subClass({ imageMagick: true });

const aws = require("aws-sdk");

const io = require("../../socket");
const Post = require("../../models/feed/post.js");
const User = require("../../models/user/user");
const Comment = require("../../models/feed/comment");
const PostVisit = require("../../models/feed/post-visit");
const FavoritePost = require("../../models/feed/favarite-post");
const imageModify = require("../../util/image");
const { s3Upload, s3DeleteOne, s3DeleteMany } = require("../../util/image");
const { testAuth } = require("../../util/auth");
const { clearImage } = require("../../util/file");

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
  secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
  region: process.env.DO_SPACE_REGION,
});
const s3 = new aws.S3();

exports.getMostVisitPosts = async (req, res, next) => {
  console.log("req.query in getPosts", req.query);
  const currentPage = req.query.page || 1;
  const perPage = 20;
  const loadLimit = 10000;

  let loadNumber = perPage + 1 + (currentPage - 1) * perPage;

  if (loadNumber > loadLimit) {
    loadNumber = loadLimit;
  }

  // let totalItems;
  // let posts;


  try {

    let popularPosts = await Post.find({ public: "public" })
      .sort({ totalVisit: -1 })
      // .skip((currentPage - 1) * perPage)
      // .limit(loadNumber);
      .limit(100);

    const totalItems = popularPosts.length;
    // console.log("popularPosts totalItems", totalItems);
    // console.log('pOUPs: ', popularPosts, totalItems);

    popularPosts = createReturnPosts(popularPosts);

    res.status(200).json({
      message: "Fetched most visit posts successfully.",
      posts: popularPosts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


const createReturnPosts = (posts) => {
  return posts.map((post) => {
    const port = process.env.PORT || 8083;

    const imageUrls = [];
    if (post.imageUrls && post.imageUrls.length > 0) {
      if (!process.env.S3NOTUSE) {
        for (const imageUrl of post.imageUrls) {
          imageUrls.push(
            s3.getSignedUrl("getObject", {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: imageUrl,
              Expires: 60 * 60,
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
              Expires: 60 * 60,
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
              Expires: 60 * 60,
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
        Expires: 60 * 60,
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
              Expires: 60 * 60,
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
              Expires: 60 * 60,
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