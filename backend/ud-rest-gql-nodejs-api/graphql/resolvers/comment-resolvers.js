// const bcrypt = require('bcryptjs');
const validator = require('validator');
// const jwt = require('jsonwebtoken');

const User = require('../../models/user/user');
const Post = require('../../models/feed/post');
const Comment = require('../../models/feed/comment');

require('dotenv').config();

module.exports = {
  comments: async function ({ postId }, req) {
    console.log('postId: ', postId);
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }

    const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });
    // console.log('comments', comments);

    // return comments;
    return comments.map(comment => {
      return {
      _id: comment._id.toString(),
      content: comment.content,
      // creator: user || null,
      creatorId: comment.creatorId,
      creator_id: comment.creator_id,
      creatorName: comment.creatorName,
      postId: comment.postId,
      parentCommentId: comment.parentCommentId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      }
    })
  },


  comment: async function ({ commentId }, req) {
    // console.log('commentId', commentId);

    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }

    const comment = await Comment.findById(commentId);
    // console.log('comment', comment,);
    return comment;
  },


  createPostComment: async function ({ commentInput }, req) {
    // console.log('commentInput', commentInput);
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty(commentInput.content) ||
      !validator.isLength(commentInput.content, { min: 1 })
    ) {
      error.push({ messge: 'Content is invalid.' });
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
      const error = new Error('user not found.');
      error.code = 404;
      throw error;
    }

    // console.log('user.imageUrl', user.imageUrl);
    console.log('commentInput', commentInput);
    console.log(req.userId, user._id.toString())
    const comment = new Comment({
      content: commentInput.content,
      // creator: user || null,
      // creatorId: user._id.toString(),
      creatorId: req.userId,
      creator_id: user._id.toString(),
      creatorName: user.name,
      creatorImageUrl: user.imageUrl,
      acceptLanguage: req.headers['accept-language'],
      postId: commentInput.postId,
      parentCommentId: commentInput.parentCommentId,
      geolocation: commentInput.locationData,
      headers: req.headers
    });
    const createdComment = await comment.save();
    console.log('createdComment', createdComment);
    // console.log('_doc', createdComment._doc);
    // user.posts.push(createdPost);
    // await user.save();
    return {
      _id: createdComment._id.toString(),
      content: commentInput.content,
      // creator: user || null,
      // creatorId: user._id.toString(),
      creatorId: req.userId,
      creator_id: user._id.toString(),
      creatorName: user.name,
      creatorImageUrl: user.imageUrl,
      postId: commentInput.postId,
      parentCommentId: commentInput.parentCommentId,
      acceptLanguage: createdComment.acceptLanguage,
      createdAt: createdComment.createdAt.toISOString(),
      updatedAt: createdComment.updatedAt.toISOString(),
    };
  },


  deletePostComment: async function ({ commentId }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const comment = await Comment.findById(commentId);
    const post = await Post.findById(comment.postId);
    if (!comment) {
      const error = new Error('comment not found');
      error.code = 404;
      throw error;
    }
    if (!post) {
      const error = new Error('post not found');
      error.code = 404;
      throw error;
    }
    // console.log('comment in del',comment);
    // console.log('post in del', post);

    if (comment.creatorId === req.userId || post.creatorId.toString() === req.userId) {
      
      if (!comment.parentCommentId) {
        await Comment.deleteMany({ parentCommentId: commentId });
      }
      
      await Comment.findByIdAndRemove(commentId);


    } else {
      const error = new Error('not Authorized.');
      error.statusCode = 403;
      throw error;
    }

    return true;
  },
}
