const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
const Comment = require('../../models/feed/comment');
const FavoritePost = require('../../models/feed/favarite-post');
const PostVisit = require('../../models/feed/post-visit');

const { clearImage } = require('../../util/file');
// const { 
//   createSmallImage,
//         createThumbnail, 
//         trimVideo } = require('../../util/image');
const imageModify = require('../../util/image');
const { s3DeleteMany } = require('../../util/image');
const { testAuth } = require('../../util/auth');

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


const titleMinLength = 1;
const contentMinLength = 1;

module.exports = {
  


  createPost: async function ({ postInput }, req) {
    // console.log('postInput', postInput);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { 
        min: titleMinLength  // max: ??
      })
    ) {
      errors.push({ messge: 'Title is invalid.' });
    }
    if (validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { 
        min: contentMinLength // max: ??
      })
    ) {
      errors.push({ messge: 'Content is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 404;
      throw error;
    }

    // console.log(postInput);
    


    let thumbnailImageUrl;
    let modifiedImageUrl
    if (postInput.imageUrl !== 'undefined') {
      modifiedImageUrl = imageModify.makeModifiedUrl(postInput.imageUrl);
      const forFileFileType = imageModify.makeFileTypeForThumbnail(postInput.imageUrl);
      const forFileFileName = imageModify.makeFileNameForThumbnail(postInput.imageUrl);
      // console.log('modifiedImageUrl', modifiedImageUrl);
      // console.log('forfilefileType', forFileFileType);
      // console.log('forFileFileName', forFileFileName);

      const fileMimetype = forFileFileType;
      // console.log('forfilefiletype', forFileFileType)
      if (
        fileMimetype === 'jpg' ||
        fileMimetype === 'jpeg' ||
        fileMimetype === 'png' ||
        fileMimetype === 'webp'
      ) {
        // console.log('in image minetype')

        // const smallImage = await imageModify.createSmallImage(postInput.imageUrl, modifiedImageUrl);
      
      }
      if (
        fileMimetype === 'mp4' ||
        fileMimetype === 'webm'
      ) {
        thumbnailImageUrl = 'images/' + forFileFileName;
        
        // const trimedVideo = await imageModify.trimVideo(postInput.imageUrl, modifiedImageUrl);
        // const thumbnail = await imageModify.createThumbnail(postInput.imageUrl, forFileFileName);
      }
    }

    const locationData = postInput.locationData;

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      imagePath: postInput.imageUrl,
      modifiedImageUrl: modifiedImageUrl,
      thumbnailImageUrl: thumbnailImageUrl,
      // creator: user,
      // creatorId: user._id.toString(),
      creatorId: req.userId,
      creator_id: user._id.toString(),
      creatorName: user.name || null,
      creatorImageUrl: user.imageUrl || null,
      language: req.headers['accept-language'],
      public: postInput.public,
      geolocation: locationData,
      headers: req.headers
    });
    const createdPost = await post.save();
    // user.posts.push(createdPost);
    user.geolocation = locationData;
    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      creatorId: createdPost.creatorId.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  posts: async function ({ page, userOnly, userId }, req) {
    // console.log('page',page, 'userOnly ', userOnly, 'userId', userId);
    // console.log('req.headers', req.headers)
    console.log(req.query);
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }

    const currentPage = page || 1;
    const perPage = 20;
    const loadLimit = 10000;

    let loadNumber = perPage + 1 + ((currentPage - 1) * perPage);
    
    if (loadNumber > loadLimit) {
        loadNumber = loadLimit;
    }

    if (!page) {
      page = 1;
    }
    // const perPage = 2;
    // const totalPosts = await Post.find().countDocuments();
    // const posts = await Post.find()
    //   .sort({ createdAt: -1})
    //   .skip((page - 1) * perPage)
    //   .limit(perPage)
    //   .populate('creator');

    // const initialPostLimit = 2;
    // let morePostRequest = Number(req.query.moreClickNum);

    console.log('userOnly', userOnly)
    if (userOnly === 'userPosts') {
      // const perPage = 10;
      // const totalPosts = await Post.find().countDocuments();
      // const posts = await Post.find()
      //   .sort({ createdAt: -1 })
      //   // .skip((page - 1) * perPage)
      //   // .limit(perPage)
      //   // .populate('creator');

      // // const start = (page - 1) * perPage
      // const userposts = posts.filter(p => {
      //   // console.log(p);
      //   return p.creatorId.toString() === userId;
      // });

      const userposts =  await Post.find({ creatorId: userId })
        // .populate('creator')
        .sort({ createdAt: -1 });
        // .limit(2)

      // return {posts: userposts.slice(start, start + perPage).map(p => {
      return {
        posts: userposts.map(post => {
          return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            imageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.imageUrl ? post.imageUrl : 'undefined',
                Expires: 60 * 60
            })
            : 'undefined',
            modifiedImageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.modifiedImageUrl ? post.modifiedImageUrl : 'dummy-key',
                Expires: 60 * 60
            })
            : undefined,
            thumbnailImageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.thumbnailImageUrl ? post.thumbnailImageUrl : 'dummy-key',
                Expires: 60 * 60
            })
            : undefined,
            imagePath: post.imageUrl,
            creatorImageUrl: post.creatorImageUrl 
            ? s3.getSignedUrl('getObject', {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
              Expires: 60 * 60
            }) 
            : null
          }
        }), totalPosts: userposts.length
      };
    }

    if (userOnly === 'publicOrUserPosts') {
      let totalPosts;
      // const perPage = 2;

      // const before = Date.now()
      // totalPosts = await Post.find().countDocuments();
      // const after = Date.now();
      // console.log('time',after - before);

      // console.log('allpots: ', totalPosts);
      // const posts = await Post.find()
      //   .sort({ createdAt: -1 });
        // .skip((page - 1) * perPage)
        // .limit(perPage)
        // .populate('creator')

      // const publicOrUserPost = posts.filter(p => {
      //   // console.log(p.public, p.creatorId);
      //   return p.public === 'public' || p.creatorId.toString() === userId;
      // })

      const publicOrUserPosts = await Post.find({ 
        $or: [{ public: 'public' }, { creatorId: userId }]
      })
        // .populate('creator')
        .sort({ createdAt: -1 })
        .limit(loadNumber);

      // totalPosts = publicOrUserPosts.length;
      console.log('publicOrUserPosts', publicOrUserPosts.length)

      return {
        posts: publicOrUserPosts.map(post => {
          return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),        
            imageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.imageUrl ? post.imageUrl : 'undefined',
                Expires: 60 * 60
            })
            : 'undefined',
            modifiedImageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.modifiedImageUrl ? post.modifiedImageUrl : 'dummy-key',
                Expires: 60 * 60
            })
            : undefined,
            thumbnailImageUrl: post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted'
            ? s3.getSignedUrl('getObject', {
                Bucket: process.env.DO_SPACE_BUCKET_NAME,
                Key: post.thumbnailImageUrl ? post.thumbnailImageUrl : 'dummy-key',
                Expires: 60 * 60
            })
            : undefined,
            imagePath: post.imageUrl,
            creatorImageUrl: post.creatorImageUrl 
            ? s3.getSignedUrl('getObject', {
              Bucket: process.env.DO_SPACE_BUCKET_NAME,
              Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
              Expires: 60 * 60
            }) 
            : null
          }
        }), totalPosts: publicOrUserPosts.length
      };
    }

  },

  post: async function ({ id, userId, locationData }, req) {
    console.log('userId', userId);
    console.log('locationData', locationData);
    // console.log('req', req.headers);
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }

    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.code = 404;
      throw error;
    }
    // console.log('post: ',post);
    // console.log('req.userId: ',req.userId);

    post.totalVisit = post.totalVisit + 1;

    await post.save();


    let postVisit = await PostVisit.findOne({ postId: id });
    // console.log('POSTVISIT', postVisit);

    if (!postVisit) {
      postVisit = new PostVisit({
        postId: post._id.toString(),
        visit: null
      });
      await postVisit.save();
    }

    const acceptLanguageList = postVisit.visit.acceptLanguage;
    
    const index = acceptLanguageList.findIndex(element => {
        return element.name === req.headers['accept-language'].split(',')[0];
    });
    // console.log('INDEX of NAME', index);
    if (index > -1) {
        acceptLanguageList[index].number = acceptLanguageList[index].number + 1;
    } else {
        acceptLanguageList.push({
            name: req.headers['accept-language'].split(',')[0],
            number: 1
        });
    }

    if (userId) {
      // const user = await User.findById(userId);
      postVisit.visit.details.push({
          userId: userId,
          geolocation: locationData,
          headers: req.headers,
      });
    } else {
      postVisit.visit.details.push({
        userId: '',
        geolocation: locationData,
        headers: req.headers,
      });
    }

    await postVisit.save();
    // console.log('post', post);



    const doUrl = s3.getSignedUrl('getObject',
      {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Key: `${post.imageUrl}`,
        Expires: 60 * 60
      }
    );


    const decodedToken = testAuth(req, '', '');
    // console.log('decodedToken', decodedToken);

    // if (post.public === 'public' || post.creatorId.toString() === req.userId) {
    if (post.public === 'public' || decodedToken && decodedToken.userId === post.creatorId) {
      return {
        ...post._doc,
        _id: post._id.toString(),
        imageUrl: doUrl,
        imagePath: post.imageUrl,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        creatorImageUrl: post.creatorImageUrl
        ? s3.getSignedUrl('getObject', {
          Bucket: process.env.DO_SPACE_BUCKET_NAME,
          Key: post.creatorImageUrl ? post.creatorImageUrl : 'dummy-key',
          Expires: 60 * 60
        }) 
        : null
      }
    } else {
      const error = new Error('Not Authorized');
      error.code = 403;
      throw error;
    }
  },
  
  updatePost: async function ({ id, postInput }, req) {
    // console.log('updatePost req.body: ', req.body);
    console.log('postInput', postInput);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate('creator');

    if (!post) {
      const error = new Error('Post not found');
      error.code = 404;
      throw error;
    }
    if (post.creatorId.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { 
        min: titleMinLength // max: ??
      })
    ) {
      errors.push({ messge: 'Title is invalid.' });
    }
    if (validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { 
        min: contentMinLength // max: ??
      })
    ) {
      errors.push({ messge: 'Content is invalid.' });
    }
    if (errors.length > 0) {
      console.log('errors',errors);
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });

    if (!user) {
      const error = new Error('User not found.');
      error.code = 404;
      throw error;
    }

    post.title = postInput.title;
    post.content = postInput.content;
    post.public = postInput.public;
    post.language = req.headers['accept-language'];
    post.geolocation = postInput.locationData;
    post.headers = req.headers;
    // console.log('postInput', postInput);

    if (postInput.imageUrl !== 'undefined') {
      post.imageUrl = postInput.imageUrl;
      post.imagePath = postInput.imageUrl;

      let modifiedImageUrl;
      let forFileFileType;
      let forFileFileName;
      let thumbnailImageUrl;

      modifiedImageUrl = imageModify.makeModifiedUrl(postInput.imageUrl);
      forFileFileType = imageModify.makeFileTypeForThumbnail(postInput.imageUrl);
      forFileFileName = imageModify.makeFileNameForThumbnail(postInput.imageUrl);

      const fileMimetype = forFileFileType;
      // console.log('forfilefiletype', forFileFileType)
      if (
        fileMimetype === 'jpg' ||
        fileMimetype === 'jpeg' ||
        fileMimetype === 'png' ||
        fileMimetype === 'webp'
      ) {
        // console.log('in image minetype')
        // const smallImage = await imageModify.createSmallImage(postInput.imageUrl, modifiedImageUrl);
        
        post.modifiedImageUrl = modifiedImageUrl;
      }
      if (
        fileMimetype === 'mp4' ||
        fileMimetype === 'webm'
      ) {
        thumbnailImageUrl = 'images/' + forFileFileName;
        
        // const trimedVideo = await imageModify.trimVideo(postInput.imageUrl, modifiedImageUrl);
        // const thumbnail = await imageModify.createThumbnail(postInput.imageUrl, forFileFileName);
        
        post.modifiedImageUrl = modifiedImageUrl;
        post.thumbnailImageUrl = thumbnailImageUrl;
      }
    }

    const updatedPost = await post.save();

    user.geolocation = postInput.locationData;
    await user.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      creatorId: updatedPost.creatorId.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },

  deletePost: async function ({ id, locationData }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error('Post not found');
      error.code = 404;
      throw error;
    }
    if (post.creatorId.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }

    // const user = await User.findById(req.userId);
    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 404;
      throw error;
    }

    // clearImage(post.imageUrl);


    const imageUrlArray = post.imageUrl.split('.');
    const fileType = imageUrlArray.pop().toLowerCase();


    // if (
    //   fileType === 'jpg' ||
    //   fileType === 'jpeg' ||
    //   fileType === 'png' ||
    //   fileType === 'webp'
    // ) {
    //   // clearImage(post.imageUrl);
    //   // clearImage(post.modifiedImageUrl);


    // }
    // if (fileType === 'mp4' || fileType === 'webm') {
    //   // clearImage(post.imageUrl);
    //   // clearImage(post.modifiedImageUrl);
    //   // clearImage(post.thumbnailImageUrl);

    // }


    if (post.imageUrl && post.imageUrl !== 'undefined' && post.imageUrl !== 'deleted') {
      let params;
      if (
        fileType === 'jpg' ||
        fileType === 'jpeg' ||
        fileType === 'png' ||
        fileType === 'webp'
      ) {
        params = {
          Bucket: process.env.DO_SPACE_BUCKET_NAME,
          Delete: {
              Objects: [
                  { Key: post.imageUrl },
                  { Key: post.modifiedImageUrl }
              ],
              // Quiet: false
          }
        };
      }
  
      if (fileType === 'mp4' || fileType === 'webm') {
        params = {
          Bucket: process.env.DO_SPACE_BUCKET_NAME,
          Delete: {
              Objects: [
                  { Key: post.imageUrl },
                  { Key: post.modifiedImageUrl },
                  { Key: post.thumbnailImageUrl },
              ],
              // Quiet: false
          }
        };
      }

      await s3DeleteMany(params);
    }

    await Post.findByIdAndRemove(id);
    
    await Comment.deleteMany({ postId: id });
    await PostVisit.deleteOne({ postId: id });

    ////delete from favorite post
    await FavoritePost.deleteMany({ postId: id });
    
    user.geolocation = locationData;
    // console.log('locatonData',locationData)
    await user.save();

    return true;

  },

  deletePostImage: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.code = 404;
      throw error;
    }
    if (post.creatorId.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }

    if (!post.imageUrl || post.imageUrl === 'undefined' || post.imageUrl === 'deleted') {
      const error = new Error('Could not find image.');
      error.statusCode = 404;
      throw error;
    }

    // console.log('post for image delete', post);
    // clearImage(post.imageUrl);

    const imageUrlArray = post.imageUrl.split('.');
    const fileType = imageUrlArray.pop().toLowerCase();

    if (
      fileType === 'jpg' ||
      fileType === 'jpeg' ||
      fileType === 'png' ||
      fileType === 'webp'
    ) {
      // clearImage(post.imageUrl);
      // clearImage(post.modifiedImageUrl);
    }
    if (fileType === 'mp4' || fileType === 'webm') {
      // clearImage(post.imageUrl);
      // clearImage(post.modifiedImageUrl);
      // clearImage(post.thumbnailImageUrl);
    }



    let params;
    if (
      fileType === 'jpg' ||
      fileType === 'jpeg' ||
      fileType === 'png' ||
      fileType === 'webp'
    ) {
      params = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Delete: {
            Objects: [
                { Key: post.imageUrl },
                { Key: post.modifiedImageUrl }
            ],
            // Quiet: false
        }
      };
    }

    if (fileType === 'mp4' || fileType === 'webm') {
      params = {
        Bucket: process.env.DO_SPACE_BUCKET_NAME,
        Delete: {
            Objects: [
                { Key: post.imageUrl },
                { Key: post.modifiedImageUrl },
                { Key: post.thumbnailImageUrl },
            ],
            // Quiet: false
        }
      };
    }

    await s3DeleteMany(params);


    post.imageUrl = 'deleted';
    post.imagePath = 'deleted';
    post.modifiedImageUrl= 'deleted';
    if (post.thumbnailImageUrl) {
      post.thumbnailImageUrl = 'deleted';
    }

    await post.save();

    return true;
  },

}
