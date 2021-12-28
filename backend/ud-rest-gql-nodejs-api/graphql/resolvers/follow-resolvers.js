// const bcrypt = require('bcryptjs');
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
// const Comment = require('../../models/comment');
const Follow = require('../../models/feed/follow');
const FollowerTable = require('../../models/feed/follower-table');
const FavoritePost = require('../../models/feed/favarite-post');

require('dotenv').config();


const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACE_ENDPOINT);
aws.config.setPromisesDependency();
aws.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_ACCESSKEYID,
    secretAccessKey: process.env.DO_SPACE_SECRETACCESSKEY,
    region: process.env.DO_SPACE_REGION
});
const s3 = new aws.S3();


module.exports = {
  getFollowingUsers: async function (args, req) {
    // console.log('userId', req.userId);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const userId = req.userId;
    // const follow = await Follow.findOne({ userId: userId });
    // if (!follow) {
    //   const error = new Error('Follow of userId not found');
    //   error.code = 404;
    //   throw error;
    // }

    // const userInfoList = [];
    // let userInfo;
    // for (let i = 0; i < follow.followingUsers.length; i++) {
    //   userInfo = await User.findById(follow.followingUsers[i].userId);
    //   // console.log(userInfo);
    //   if (userInfo) {
    //     userInfoList.push({
    //       userId: userInfo._id.toString(),
    //       name: userInfo.name,
    //       imageUrl: userInfo.imageUrl,
    //       addAt: follow.followingUsers[i].addAt
    //     });
    //   }
    // }



    //// get from follwer-table
    const followerElements = await FollowerTable.find({
      userId: userId
    });
    console.log('followerElements', followerElements);

    const returnUserList = [];
    if (followerElements.length > 0) {
        const users = await User.find({});

        for (const element of followerElements) {
            const addUser = users.find(user => {
                return user.userId === element.followingUserId;
            });
            console.log('addUser', addUser)
            if (addUser) {
                returnUserList.push({
                    _id: addUser._id.toString(),
                    userId: addUser.userId,
                    name: addUser.name,
                    // imageUrl: addUser.imageUrl,
                    imageUrl: addUser.imageUrl && addUser.imageUrl !== 'undefined' && addUser.imageUrl !== 'deleted'
                    ? s3.getSignedUrl('getObject', {
                        Bucket: process.env.DO_SPACE_BUCKET_NAME,
                        Key: addUser.imageUrl ? addUser.imageUrl : 'undefined',
                        Expires: 60 * 60
                    })
                    // : 'undefined',
                    : null,
                    createdAt: addUser.createdAt.toISOString()
                })
            }
        }
    }
    // console.log('returnUserList', returnUserList);

    // return userInfoList;
    return returnUserList;

    // return follow.followingUsers.map(element => {
    //   return {
    //     userId: element.userId,
    //     // name: element.name,
    //     // imageUrl: element.imageUrl
    //   }
    // });
  },

  getFollowingUser: async function ({ followingUserId }, req) {
    // console.log('userId', req.userId);

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const userId = req.userId;
    // const follow = await Follow.findOne({ userId: userId });
    // if (!follow) {
    //   const error = new Error('Follow of userId not found');
    //   error.code = 404;
    //   throw error;
    // }

    // const userInfo = follow.followingUsers.find(element => {
    //   return element.userId === followingUserId
    // });
    // if (!userInfo) {
    //   const error = new Error('FollowingUser not found');
    //   error.code = 404;
    //   throw error;
    // }

    // const allUserInfo = await User.findById(followingUserId);
    // if (!allUserInfo) {
    //   const error = new Error('user could not find.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const returnUInfo = {
    //   userId: allUserInfo._id.toString(),
    //   name: allUserInfo.name,
    //   imageUrl: allUserInfo.imageUrl,
    //   addAt: userInfo.addAt
    // };





      ///// get from followerTable
      const followerElement = await FollowerTable.findOne({
        userId: userId,
        followingUserId: followingUserId,
    });

    if (!followerElement) {
        // return;
        const error = new Error('following user could not find in follower-table.');
        error.statusCode = 404;
        throw error;
    }

    const returnUserAllInfo = await User.findOne({ userId: followingUserId });
    // const returnUserAllInfo = await User.find({ _id: followingUserId });
    // console.log(returnUserAllInfo);

    const returnUserInfo = {
        _id: returnUserAllInfo._id.toString(),
        userId: returnUserAllInfo.userId,
        name: returnUserAllInfo.name,
        imageUrl: returnUserAllInfo.imageUrl,
        createdAt: returnUserAllInfo.createdAt.toISOString(),
    }



    // return returnUInfo;
    return returnUserInfo;
  },

  addFollowingUser: async ({ userId, followingUserId }, req) => {

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    if (userId === followingUserId) {
      console.log('cannot add yourself');
      const error = new Error('cannot add yourself.');
      error.statusCode = 400;
      throw error;
      // res.status(400).json({ message: 'cannot add yourself.' });
    }

    // const follow = await Follow.findOne({ userId: userId });
    // const followUser = await User.findById(followingUserId);

    // if (!followUser) {
    //   const error = new Error('following user not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const content = {
    //   userId: followUser._id.toString(),
    //   addAt: Date.now()
    //   // name: followUser.name,
    //   // imageUrl: followUser.imageUrl ? followUser.imageUrl : null
    // }

    // let createdFollow;
    // if (!follow) {
    //   const newFollow = new Follow({
    //     userId: userId,
    //     followingUsers: [],
    //     // followedUserIds: [],
    //     favoritePosts: []
    //   });
    //   await newFollow.save();
    //   // newFollow.followingUserIds.push(followingUserId);
    //   newFollow.followingUsers.push(content);
    //   createdFollow = await newFollow.save();
    // }

    // // console.log(createdFollow);
    // else {
    //   // if (follow) {
    //   const followUserFind = follow.followingUsers.findIndex(user => {
    //     return user.userId === followingUserId;
    //   });
    //   console.log('followUserFind: ', followUserFind);


    //   if (follow && followUserFind < 0) {
    //     // follow.followingUserIds.push(followingUserId);
    //     follow.followingUsers.push(content);
    //     createdFollow = await follow.save();
    //   }

    //   if (follow && followUserFind >= 0) {
    //     const error = new Error('followingUser already exist.');
    //     error.statusCode = 400;
    //     throw error;
    //     // res.status(400).json({ message: 'followingUserId is already exist.' });
    //   }

    // }

    // const userInfo = createdFollow.followingUsers.find(element => {
    //   return element.userId === followingUserId;
    // });




    //// add in followerTable
    const user = await User.findOne({ userId: req.userId });

    const followerElement = await FollowerTable.findOne({
        userId: userId,
        followingUserId: followingUserId,
    });

    let addFollowElement;
    if (!followerElement) {
        addFollowElement = new FollowerTable({
            userId: userId,
            user_id: user._id.toString(),
            followingUserId: followingUserId,
        });
        await addFollowElement.save();
    } else {
        addFollowElement = followerElement;
    }





    // return userInfo;
    return addFollowElement;
  },

  deleteFollowingUser: async ({ userId, followingUserId }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    if (userId === followingUserId) {
      console.log('cannot delete yourself');
      const error = new Error('cannot delete yourself.');
      error.statusCode = 400;
      throw error;
      // res.status(400).json({ message: 'cannot add yourself.' });
    }

    // const follow = await Follow.findOne({ userId: userId });

    // if (!follow) {
    //   const error = new Error('follow of userId could not find.');
    //   error.statusCode = 404;
    //   throw error;
    //   // res.status(404).json({ message: 'follow of userId could not find.' });
    // }

    // const followUserFind = follow.followingUsers.findIndex(user => {
    //   return user.userId === followingUserId;
    // });
    // console.log('followUserFind: ', followUserFind);

    // if (follow && followUserFind < 0) {
    //   const error = new Error('followingUser could not find.');
    //   error.statusCode = 404;
    //   throw error;
    //   // res.status(404).json({ message: 'follow of userId could not find.' });
    // }

    // if (follow && followUserFind >= 0) {
    //   const deleted = follow.followingUsers.filter(element => {
    //     return element.userId !== followingUserId;
    //   });

    //   follow.followingUsers = deleted;
    //   await follow.save();
    // }



      //// delete from followerTable
      const followerElement = await FollowerTable.findOne({
          userId: userId,
          followingUserId: followingUserId,
      });

      if (followerElement) {
          await FollowerTable.deleteOne({
              userId: userId,
              followingUserId: followingUserId
          });
      } else {
          const error = new Error('followingElement does not exist.');
          error.statusCode = 400;
          throw error;
      }




    return true;
  },

  getFollowedUserList: async function ({ userId }, req) {
    // console.log('userId', req.userId);
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }

    // const userId = req.userId;
    // const user = await User.findById(userId);
    // if (!user) {
    //   const error = new Error('user not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const follow = await Follow.find();
    // if (!follow) {
    //   const error = new Error('follow not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }
    // // console.log('follow', follow);

    // const followingUserList = [];

    // for (let i = 0; i < follow.length; i++) {
    //   if (follow[i].followingUsers && follow[i].followingUsers.length > 0) {
    //     // console.log('userfollow', follow[i].followingUsers);

    //     const userInfo = await User.findById(follow[i].userId);
    //     const userfollow = follow[i].followingUsers;

    //     for (let k = 0; k < userfollow.length; k++) {
    //       console.log('userfollow[k]', userfollow[k]);
    //       if (userfollow[k].userId === userId) {
    //         followingUserList.push({
    //             userId: follow[i].userId,
    //             name: userInfo.name,
    //             imageUrl: userInfo.imageUrl,
    //             addAt: userfollow[k].addAt
    //           });
    //       }
    //     }

    //   }

    // }
    // // console.log('followingUserList', followingUserList);
    // const returnData = {
    //   userId: userId,
    //   followedByList: followingUserList 
    // };



    //// get from follower-table
    console.log('userId', req.userId);
    const followerElements = await FollowerTable.find({
        followingUserId: req.userId
    });
    // console.log('followerElements', followerElements);

    const returnUserList = [];

    if (followerElements.length > 0) {
        const users = await User.find({});

        for (const element of followerElements) {
            const addUser = users.find(user => {
                return user.userId === element.userId;
            });

            if (addUser) {
                returnUserList.push({
                    _id: addUser._id.toString(),
                    userId: addUser.userId,
                    name: addUser.name,
                    imageUrl: addUser.imageUrl,
                    createdAt: addUser.createdAt.toISOString(),
                });
            }
        }
    }


    // return returnData;
    return returnUserList;
  },


  getFavoritePosts: async function (args, req) {
    // console.log('userId', req.userId);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const userId = req.userId;
    // const follow = await Follow.findOne({ userId: userId });
    // if (!follow) {
    //   const error = new Error('Follow of userId not found');
    //   error.code = 404;
    //   throw error;
    // }

    // const postInfoList = [];
    // const updateFollowPosts = [];
    // let postInfo;
    // for (let i = 0; i < follow.favoritePosts.length; i++) {
    //   postInfo = await Post.findById(follow.favoritePosts[i].postId);
    //   // console.log(userInfo);
    //   if (postInfo) {
    //     updateFollowPosts.push({
    //       postId: postInfo._id.toString()
    //     });

    //     if (postInfo.public === 'public') {
    //       postInfoList.push(postInfo);
    //     }
    //   }
    // }

    // follow.favoritePosts = updateFollowPosts;
    // await follow.save();

    // // return postInfoList;

    // return postInfoList.map(post => {
    //     return {
    //       ...post._doc,
    //       _id: post._id.toString(),
    //       createdAt: post.createdAt.toISOString(),
    //       updatedAt: post.updatedAt.toISOString(),
    //       imageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
    //       ? s3.getSignedUrl('getObject', {
    //           Bucket: process.env.DO_SPACE_BUCKET_NAME,
    //           Key: post.imageUrl ? post.imageUrl : 'undefined',
    //           Expires: 60 * 60
    //       })
    //       : 'undefined',
    //       modifiedImageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
    //       ? s3.getSignedUrl('getObject', {
    //           Bucket: process.env.DO_SPACE_BUCKET_NAME,
    //           Key: post.modifiedImageUrl ? post.modifiedImageUrl : 'dummy-key',
    //           Expires: 60 * 60
    //       })
    //       : undefined,
    //       thumbnailImageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
    //       ? s3.getSignedUrl('getObject', {
    //           Bucket: process.env.DO_SPACE_BUCKET_NAME,
    //           Key: post.thumbnailImageUrl ? post.thumbnailImageUrl : 'dummy-key',
    //           Expires: 60 * 60
    //       })
    //       : undefined,
    //       imagePath: post.imageUrl,
    //       // creatorImageUrl: post.creatorImageUrl 
    //       // ? s3.getSignedUrl('getObject', {
    //       //   Bucket: process.env.DO_SPACE_BUCKET_NAME,
    //       //   Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
    //       //   Expires: 60 * 60
    //       // }) 
    //       // : null
    //     }
    //   })
    //   .reverse()

    
    // return follow.favoritePosts.map(element => {
    //   return {
    //     postId: element.postId,
    //     // title: element.title,
    //     // imageUrl: element.imageUrl,
    //     // modifiedImageUrl: element.modifiedImageUrl,
    //     // thumbnailImageUrl: element.thumbnailImageUrl,
    //     // public: element.public,
    //     creatorId: element.creatorId
    //   }
    // });



      //// get from favoritePost
      const favoritePostElements = await FavoritePost.find({ userId: req.userId });
      // console.log('favoritePostElements', favoritePostElements);

      const favoritePostElementList = [];
      for (const element of favoritePostElements) {
          const favoritePostElement = await Post.findById(element.postId);
          
          if (favoritePostElement && favoritePostElement.public === 'public') {
              favoritePostElementList.push(favoritePostElement);
          }
      }
      // console.log('favoritePostElementList', favoritePostElementList);

      const returnPostList = favoritePostElementList.map(post => {
          return {
              ...post._doc,
              _id: post._id.toString(),
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString(),
              imagePath: post.imageUrl,
              imageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
                  ? s3.getSignedUrl('getObject', {
                      Bucket: process.env.DO_SPACE_BUCKET_NAME,
                      Key: post.imageUrl,
                      Expires: 60 * 60
                  })
                  : 'undefined',
              modifiedImageUrl: post.modifiedImageUrl && post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
                  ? s3.getSignedUrl('getObject', {
                      Bucket: process.env.DO_SPACE_BUCKET_NAME,
                      Key: post.modifiedImageUrl,
                      Expires: 60 * 60
                  })
                  : undefined,
              thumbnailImageUrl: post.thumbnailImageUrl && post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
                  ? s3.getSignedUrl('getObject', {
                      Bucket: process.env.DO_SPACE_BUCKET_NAME,
                      Key: post.thumbnailImageUrl,
                      Expires: 60 * 60
                      })
                  : undefined,
              creatorImageUrl: post.creatorImageUrl
                  ? s3.getSignedUrl('getObject', {
                      Bucket: process.env.DO_SPACE_BUCKET_NAME,
                      Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
                      Expires: 60 * 60
                    }) 
                  : null
          }
      })
      .reverse();

      return returnPostList

  },

  getFavoritePost: async function ({ postId }, req) {
    // console.log('userId', req.userId);

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const userId = req.userId;
    // const follow = await Follow.findOne({ userId: userId });
    // if (!follow) {
    //   const error = new Error('Follow of userId not found');
    //   error.code = 404;
    //   throw error;
    // }

    // // const postInfo = follow.favoritePosts.find(element => {
    // //   return element.postId === postId;
    // // });
    // // if (!postInfo) {
    // //   const error = new Error('favoritePost not found');
    // //   error.code = 404;
    // //   throw error;
    // // }

    // const favoritePostIndex = follow.favoritePosts.findIndex(ele => {
    //   return ele.postId === postId;
    // });
    // if (favoritePostIndex < 0) {
    //   const error = new Error('favoritePost could not find.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const postInfoIndex = follow.favoritePosts[favoritePostIndex];
    // const postInfo = await Post.findById(postInfoIndex.postId);

    // if (!postInfo) {
    //   const updateFollowPosts = follow.favoritePosts.filter(post => {
    //     return post.postId !== postId;
    //   });

    //   follow.favoritePosts = updateFollowPosts;
    //   await follow.save();

    //   const error = new Error('post could not find.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // if (postInfo && postInfo.public !== 'public') {
    //   const error = new Error('post could not find.');
    //   error.statusCode = 404;
    //   throw error;
    // }



      //// get from favoritePost
      const favoritePostElement = await FavoritePost.findOne({ 
        userId: req.userId,
        postId: postId
      });

      if (!favoritePostElement) {
          const error = new Error('favoritePostElement not find.');
          error.statusCode = 404;
          throw error;
      }

      
      const favoritePostData = await Post.findById(favoritePostElement.postId);
      // console.log('favoritePostElements', favoritePostElement);
      if (favoritePostData && favoritePostData.public !== 'public') {
          const error = new Error('post could not find.');
          error.statusCode = 404;
          throw error;
      }

      return {
        ...favoritePostData._doc,
        _id: favoritePostData._id.toString(),
        createdAt: favoritePostData.createdAt.toISOString(),
        updatedAt: favoritePostData.updatedAt.toISOString(),
        imagePath: favoritePostData.imageUrl,
        imageUrl: favoritePostData.imageUrl && favoritePostData.imageUrl !== 'undefined' && favoritePostData.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: favoritePostData.imageUrl,
                Expires: 60 * 60
            })
            : 'undefined',
        modifiedImageUrl: favoritePostData.modifiedImageUrl && favoritePostData.imageUrl && favoritePostData.imageUrl !== 'undefined' && favoritePostData.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: favoritePostData.modifiedImageUrl,
                Expires: 60 * 60
            })
            : undefined,
        thumbnailImageUrl: favoritePostData.thumbnailImageUrl && favoritePostData.imageUrl && favoritePostData.imageUrl !== 'undefined' && favoritePostData.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: favoritePostData.thumbnailImageUrl,
                Expires: 60 * 60
                })
            : undefined,
        creatorImageUrl: favoritePostData.creatorImageUrl
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: favoritePostData.creatorImageUrl ? favoritePostData.creatorImageUrl : 'dummy-key',
                Expires: 60 * 60
              }) 
            : null
    }



    // return postInfo;

  },

  addFavoritePost: async ({ postId, userId }, req) => {

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    // const follow = await Follow.findOne({ userId: userId });
    // const favoritePost = await Post.findById(postId);

    // if (!favoritePost) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const content = {
    //   postId: favoritePost._id.toString(),
    //   addAt: Date.now()
    //   // title: favoritePost.title,
    //   // imageUrl: favoritePost.imageUrl,
    //   // modifiedImageUrl: favoritePost.modifiedImageUrl,
    //   // thumbnailImageUrl: favoritePost.thumbnailImageUrl,
    //   // public: favoritePost.public,
    //   // creatorId: favoritePost.creatorId
    // };

    // let createdFollow;
    // if (!follow) {
    //   const newFollow = new Follow({
    //     userId: userId,
    //     followingUsers: [],
    //     favoritePosts: []
    //   });
    //   await newFollow.save();
    //   newFollow.favoritePosts.push(content);
    //   createdFollow = await newFollow.save();
    // }
    // else {
    //   const postFind = follow.favoritePosts.findIndex(post => {
    //     return post.postId === postId;
    //   });
    //   console.log('postFind: ', postFind);

    //   if (follow && postFind < 0) {
    //     // follow.followingUserIds.push(followingUserId);
    //     follow.favoritePosts.push(content);
    //     createdFollow = await follow.save();
    //   }

    //   if (follow && postFind >= 0) {
    //     const error = new Error('favoritePost already exist.');
    //     error.statusCode = 400;
    //     throw error;
    //     // res.status(400).json({ message: 'followingUserId already exist.' });
    //   }
    // }

    // const postInfo = createdFollow.favoritePosts.find(element => {
    //   return element.postId === postId;
    // });



    //// add in favoritePost
    const user = await User.findOne({ userId: req.userId });

    const favoritePostElement = await FavoritePost.findOne({
          userId: userId,
          postId: postId,
          // postCreatorUserId: postElement.creatorId,
      });

      let addFavoriteElement;
      if (!favoritePostElement) {
          addFavoriteElement = new FavoritePost({
              userId: userId,
              postId: postId,
              user_id: user._id.toString(),
          });
          await addFavoriteElement.save();

      } else {
          addFavoriteElement = favoritePostElement;
      }



    // return postInfo;
    return addFavoriteElement;
  },

  deleteFavoritePost: async ({ postId, userId }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    // const follow = await Follow.findOne({ userId: userId });
    // const favoritePost = await Post.findById(postId);

    // if (!favoritePost) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    // if (!follow) {
    //   const error = new Error('follow of userId could not find.');
    //   error.statusCode = 404;
    //   throw error;
    //   // res.status(404).json({ message: 'follow of userId could not find.' });
    // }

    // const postFind = follow.favoritePosts.findIndex(post => {
    //   return post.postId === postId;
    // });
    // console.log('postFind: ', postFind);

    // if (follow && postFind < 0) {
    //   const error = new Error('favoritePost could not find.');
    //   error.statusCode = 404;
    //   throw error;
    //   // res.status(404).json({ message: 'follow of userId could not find.' });
    // }

    // if (follow && postFind >= 0) {
    //   const deleted = follow.favoritePosts.filter(element => {
    //     return element.postId !== postId;
    //   });
    //   follow.favoritePosts = deleted;
    //   await follow.save();
    // }




    //// delete from favoritePost
    const favoritePostElement = await FavoritePost.findOne({
          userId: userId,
          postId: postId,
          // postCreatorUserId: postElement.creatorId,
      });

      if (favoritePostElement) {
          await FavoritePost.deleteOne({
              userId: userId,
              postId: postId,
              // postCreatorUserId: postElement.creatorId,
          });
      } else {
          const error = new Error('favoritePostElement does not exist.');
          error.statusCode = 400;
          throw error;
      }




    return true;
  },

  getFavoritePostUserList: async function ({ postId }, req) {
    // console.log('userId', req.userId);
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }

    // const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('post not found.');
        error.statusCode = 404;
        throw error;
    }

    // const follow = await Follow.find();

    // if (!follow) {
    //   const error = new Error('follow not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }
    // // console.log('follow', follow);

    // const favoriteUserList = [];

    // for (let i = 0; i < follow.length; i++) {
    //   if (follow[i].favoritePosts && follow[i].favoritePosts.length > 0) {
    //     // console.log('userfollow', follow[i].followingUsers);
    //     const userInfo = await User.findById(follow[i].userId);
    //     const userfollow = follow[i].favoritePosts;

    //     for (let k = 0; k < userfollow.length; k++) {
    //       // console.log('userfollow[k]', userfollow[k].userId);
    //       if (userfollow[k].postId === postId) {
    //         // followingUserList.push({
    //         //   userId: userfollow[k].userId,
    //         //   followedBy: follow[i].userId
    //         // });
            
    //         favoriteUserList.push({
    //             userId: follow[i].userId,
    //             name: userInfo.name,
    //             imageUrl: userInfo.imageUrl,
    //             addAt: userfollow[k].addAt
    //         });
    //         // favoriteUserList.push(follow[i].userId);
    //       }
    //     }
    //   }
    // }
    // // console.log('followingUserList', followingUserList);
    
    
    //// get from favoritePost
    const favoritePostElements = await FavoritePost.find({ 
        postId: postId 
    });

    // console.log('favoritePosetElements', favoritePostElements);
    
    const users = await User.find({});

    const favoriteUserList = [];

    for (const element of favoritePostElements) {
        // const userInfo = await User.findOne({ userId: element.userId });
        const userInfo = users.find(user => user.userId === element.userId);
        // console.log('userInfo', userInfo);
        if (userInfo) {
            favoriteUserList.push({
                _id: userInfo._id.toString(),
                userId: userInfo.userId,
                name: userInfo.name,
                // imageUrl: userInfo.imageUrl,
                imageUrl: userInfo.imageUrl && userInfo.imageUrl !== 'undefined' && userInfo.imageUrl !== 'deleted'
                ? s3.getSignedUrl('getObject', {
                    Bucket: process.env.DO_SPACE_BUCKET_NAME,
                    Key: userInfo.imageUrl,
                    Expires: 60 * 60
                })
                // : 'undefined',
                : null,
                createdAt: userInfo.createdAt.toISOString(),
            });
        }
    }

    const returnData = {
        postId: postId,
        favoritedByList: favoriteUserList 
    };
  

    return returnData;
  },


}
