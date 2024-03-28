const _ = require('lodash');

const aws = require("aws-sdk");
const jwt = require('jsonwebtoken');

const Post = require("../../models/feed/post.js");
const User = require('../../models/user/user');
const UserReactionType = require('../../models/feed/user-reaction-type');
const UserReaction = require('../../models/feed/user-reaction');
const FilteredPosts = require('../../models/feed/filtered-posts');
const UserRecentVisit = require('../../models/user/user-recent-visit');

// const Redis = require('redis');
const { createClient } = require('redis');

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

const getMostVisitPosts = async (req, res, next) => {
  console.log("req.query in getMostVisitPosts", req.query);
  // const currentPage = req.query.page || 1;
  // const perPage = 20;
  // const loadLimit = 10000;

  // let loadNumber = perPage + 1 + (currentPage - 1) * perPage;

  // if (loadNumber > loadLimit) {
  //   loadNumber = loadLimit;
  // }

  // let totalItems;
  // let posts;


  try {
    if (req.redisCachedData && req.redisCachedData.posts && 
      req.redisCachedData.posts.length > 0
    ) {

      const userIdsForNameList = [];

      for (const post of req.redisCachedData.posts) {
        userIdsForNameList.push(post.creatorId);
      }

      let userNameDataList = [];
      let token;
      const authHeader = req.get('Authorization');
      
      if (authHeader) {
        token = authHeader.split(' ')[1];
      }

      userNameDataList = await getUserNameDataListByUserIds(token, userIdsForNameList);

      return res.status(200).json({
        ...req.redisCachedData,
        userNameDataList: userNameDataList,
      });
    }

    let mostVisitPosts = await FilteredPosts.findOne({ name: 'mostVisitPosts' });

    //// some time update;
    if (!mostVisitPosts) {
      mostVisitPosts = await createMostVisitPosts(req, res, next);
    }

    if (mostVisitPosts && mostVisitPosts.createTime < Date.now() - 1000 * 60 * 60 * 12) {
    // if (mostVisitPosts && mostVisitPosts.createTime < Date.now() - 1000 * 60) {
      mostVisitPosts = await createMostVisitPosts(req, res, next);
    }

    const userIdsForNameList = [];

    for (const post of mostVisitPosts.posts) {
      userIdsForNameList.push(post.creatorId);
    }

    let userNameDataList = [];
    let token;
    const authHeader = req.get('Authorization');
    
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }

    userNameDataList = await getUserNameDataListByUserIds(token, userIdsForNameList);

    res.status(200).json({
      message: "Fetched most visit posts successfully.",
      posts: mostVisitPosts.posts,
      totalItems: mostVisitPosts.posts.length,
      userNameDataList: userNameDataList,
    });


    //// store data in redis for cache
    if (req.redisKey) {
      // const redisClient = await connectRedis();

      const redisHost = process.env.REDIS_HOST;
      const redisClient = createClient({
          url: `redis://@${redisHost}:6379`
      });

      redisClient.on("error", function(error) {
        console.error(error);
        redisClient.quit();
        return;
      });

      redisClient.on("connect", async function(connect) {
        if (redisClient) {

          redisClient.get(req.redisKey, function(err, data) {
            console.log(data);
          });
          
          redisClient.setex(
            req.redisKey, 
            60*60, 
            JSON.stringify({
              message: "Fetched most visit posts successfully. cs",
              posts: mostVisitPosts.posts,
              totalItems: mostVisitPosts.posts.length,
            }),
          );

          redisClient.quit();

          // redisClient.set(
          //   req.redisKey, 
          //   JSON.stringify({
          //     message: "Fetched most visit posts successfully. cs",
          //     posts: mostVisitPosts.posts,
          //     totalItems: mostVisitPosts.posts.length,
          //   }),
          //   'EX',
          //   10
          //   // {
          //   //   EX: 60*60, // expire second
          //   //   NX: true,  // set a key when not exist in redis
          //   // }
          // );
    
          // await redisClient.disconnect();
        }
      })
  
    }

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


const createMostVisitPosts = async (req, res, next) => {
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


    let mostVisitPosts = await FilteredPosts.findOne({
      name: 'mostVisitPosts'
    });

    if (!mostVisitPosts) {
      mostVisitPosts = new FilteredPosts({
        name: 'mostVisitPosts',
        posts: popularPosts,
        createTime: Date.now(),
      })
      await mostVisitPosts.save();
      // console.log(mostLikePosts);
    } 
    else {
      mostVisitPosts.posts = popularPosts;
      mostVisitPosts.createTime = Date.now();
      await mostVisitPosts.save();
    }

    return mostVisitPosts;

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
      //         Expires: 60 * 60 * 24 * 365
      //       })
      //     : null,
      creatorImageUrl: creatorImageUrl,
      imageUrls: imageUrls,
      modifiedImageUrls: modifiedImageUrls,
      thumbnailImageUrls: thumbnailImageUrls,
    };
  });
};


const getMostReactionPosts = async (req, res, next) => {
  try {

    if (req.redisCachedData && req.redisCachedData.posts && 
          req.redisCachedData.posts.length > 0
    ) {

        const userIdsForNameList = [];

        for (const post of req.redisCachedData.posts) {
          userIdsForNameList.push(post.creatorId);
        }
  
        let userNameDataList = [];
        let token;
        const authHeader = req.get('Authorization');
        
        if (authHeader) {
          token = authHeader.split(' ')[1];
        }
  
        userNameDataList = await getUserNameDataListByUserIds(token, userIdsForNameList);
  
        return res.status(200).json({
          ...req.redisCachedData,
          userNameDataList: userNameDataList,
        });
    }

      const type = req.query.type;
      // console.log('type', type);

      let mostLikePosts = await FilteredPosts.findOne({ name: `most${type}Posts` });

      //// some time update;
      if (!mostLikePosts) {
        mostLikePosts = await createMostReactionPosts(req, res, next);
      }

      if (mostLikePosts && mostLikePosts.createTime < Date.now() - 1000 * 60 * 60 * 12) {
        mostLikePosts = await createMostReactionPosts(req, res, next);
      }

      if (!mostLikePosts) {
        const error = new Error('entered type of most reaction list not exist');
        error.statusCode = 404;
        throw error;
      }

      const userIdsForNameList = [];

      for (const post of mostLikePosts.posts) {
        userIdsForNameList.push(post.creatorId);
      }

      console.log('userIdsForNameList',userIdsForNameList)

      let userNameDataList = [];
      let token;
      const authHeader = req.get('Authorization');
      
      if (authHeader) {
        token = authHeader.split(' ')[1];
      }

      userNameDataList = await getUserNameDataListByUserIds(token, userIdsForNameList);

      res.status(200).json({
        message: `Fetched most ${type} posts successfully.`,
        posts: mostLikePosts.posts,
        totalItems: mostLikePosts.posts.length,
        userNameDataList: userNameDataList,
      });
      // res.status(200).json({message: 'most like posts get success', data: { posts: mostLikePosts.posts } });


      if (req.redisKey) {
        //// store data in redis for cache
        // const redisClient = await connectRedis();

        const redisHost = process.env.REDIS_HOST;
        const redisClient = createClient({
            url: `redis://@${redisHost}:6379`
        });

        redisClient.on("error", function(error) {
          console.error(error);
          redisClient.quit();
          return;
        });

        redisClient.on("connect", async function(connect) {
          if (redisClient) {
  
            redisClient.get(req.redisKey, function(err, data) {
              console.log(data);
            });
            
            redisClient.setex(
              req.redisKey, 
              60*60, 
              JSON.stringify({
                message: `Fetched most ${type} posts successfully. cs`,
                posts: mostLikePosts.posts,
                totalItems: mostLikePosts.posts.length,
              }),
            );
  
            redisClient.quit();
  
  
            // const redisSetResult = await redisClient.set(
            //   req.redisKey,
            //   JSON.stringify({
            //     message: `Fetched most ${type} posts successfully. cs`,
            //     posts: mostLikePosts.posts,
            //     totalItems: mostLikePosts.posts.length,
            //   }),
            //   {
            //     EX: 60*60, // expire second
            //     // EX: 10,
            //     NX: true,  // set a key when not exist in redis
            //   }
            // );
    
            // await redisClient.disconnect();
          }
        });

      }

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


const createMostReactionPosts = async (req, res, next) => {
  try {
    const type = req.query.type;
    console.log('type', type);

    // const userReactionType = await UserReactionType.findOne({ type: type });

    // if (!userReactionType) {
    //   const error = new Error('User Reaction Type not exist.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const typeIdNumber = userReactionType.typeIdNumber;
    
    let typeIdNumber = -1;  // 'Like': 1, ....
    if (type === 'Like') {
      typeIdNumber = 1;
    }

    const typeReactions = await UserReaction.find({
      typeIdNumber: typeIdNumber,
    });

    if (!typeReactions || typeReactions.length === 0) { 
      return null;
    }
    else {
      var count = {};
      typeReactions.forEach(function(i) { 
        // count[i] = (count[i]||0) + 1;
        count[i.postId] = (count[i.postId] || 0) + 1;
      });

      var sortable = [];
      for (var element in count) {
          sortable.push([element, count[element]]);
      }

      sortable.sort(function(a, b) {
          return b[1] - a[1];
      });

      sortable = sortable.slice(0, 50);
      // console.log('sortable', sortable);
      // const sortedCount = _.fromPairs(_.sortBy(_.toPairs(count), 1).reverse());
      // const topCountList = Object.entries(sortedCount).slice(0,20);
      
      let postList = [];
      for (const ele of sortable) {
        const post = await Post.findOne({ _id: ele[0] });
        if (post && post.public === 'public') {
          postList.push(post);
        }
      }

      //// replace imageUrls
      postList = createReturnPosts(postList);

      let mostLikePosts = await FilteredPosts.findOne({
        name: `most${type}Posts`
      });

      if (!mostLikePosts) {
        mostLikePosts = new FilteredPosts({
          name: `most${type}Posts`,
          posts: postList,
          createTime: Date.now(),
        })
        await mostLikePosts.save();
        // console.log(mostLikePosts);
      } 
      else {
        mostLikePosts.posts = postList;
        mostLikePosts.createTime = Date.now();
        await mostLikePosts.save();
      }

      // console.log(mostLikePosts);

      return mostLikePosts;
    }


  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}





module.exports = {
  getMostReactionPosts: getMostReactionPosts,
  getMostVisitPosts: getMostVisitPosts,
  createReturnPosts: createReturnPosts,
}