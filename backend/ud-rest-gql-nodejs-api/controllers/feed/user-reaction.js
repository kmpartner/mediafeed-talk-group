const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const io = require('../../socket');
const Post = require('../../models/feed/post.js');
const User = require('../../models/user/user');
const Comment = require('../../models/feed/comment');

const UserReactionType = require('../../models/feed/user-reaction-type');
const UserReaction = require('../../models/feed/user-reaction');
const { request } = require('http');


exports.createUserReactionType = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;

  try {
    let userReactionType;
    const reactionTypes = await UserReactionType.find({});
    const TypesLength = reactionTypes.length;
    // console.log(TypesLength);

    userReactionType = await UserReactionType.findOne({ type: type });
    if (userReactionType) {
      const error = new Error('User Reaction Type already exist.');
      error.statusCode = 400;
      throw error;
    }

    userReactionType = new UserReactionType({
      type: type,
      typeIdNumber: TypesLength + 1
    });

    await userReactionType.save();

    res.status(200).json({ message: 'User Reaction Type Created.', data: userReactionType });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.createPostUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  // const userId = req.userId;
  const userId = req.body.userId;
  const postId = req.body.postId;
  // const userId = 'someUserId';
  // const postId = 'somePostId';

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const post = Post.findById(postId);
    // if (!post) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;

    if (userId) {
      const existingReaction = await UserReaction.findOne({
        userId: userId,
        postId: postId,
        typeIdNumber: typeIdNumber,
      });
  
      if (existingReaction) {
        const error = new Error('Reaction by the userId already exist.');
        error.statusCode = 400;
        throw error;
      }

      userReaction = new UserReaction({
        userId: userId,
        postId: postId,
        typeIdNumber: typeIdNumber
      });

      await userReaction.save();

    } 
    else {
      userReaction = new UserReaction({
        userId: '',
        postId: postId,
        typeIdNumber: typeIdNumber
      });

      await userReaction.save();
    }



    res.status(200).json({ message: 'User Reaction Created.', data: userReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getPostUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const postId = req.body.postId;

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const post = Post.findById(postId);
    // if (!post) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    let userReaction = [];

    if (type) {
      const userReactionType = await UserReactionType.findOne({ type: type });

      if (!userReactionType) {
        const error = new Error('User Reaction Type not exist.');
        error.statusCode = 400;
        throw error;
      }
  
      const typeIdNumber = userReactionType.typeIdNumber;
  
      userReaction = await UserReaction.find({
        // userId: userId,
        postId: postId,
        typeIdNumber: typeIdNumber,
      });      
    }
    else {
      userReaction = await UserReaction.find({
        // userId: userId,
        postId: postId,
        // typeIdNumber: typeIdNumber,
      });
    }
    // console.log('userReaction', userReaction);

    const postReaction = userReaction.filter(reaction => {
      return !reaction.commentId;
    })
    // console.log('postReaction', postReaction);

    res.status(200).json({ message: 'User Post Reactions found.', data: postReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deletePostUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const postId = req.body.postId;

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const post = Post.findById(postId);
    // if (!post) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;
    userReaction = await UserReaction.findOne({
      userId: userId,
      postId: postId,
      typeIdNumber: typeIdNumber,
    });

    if (!userReaction) {
      const error = new Error('The User Reaction not found.');
      error.statusCode = 404;
      throw error;
    }

    const deletedReaction = await userReaction.deleteOne({
      userId: userId,
      postId: postId,
      typeIdNumber: typeIdNumber,
    });

    res.status(200).json({ message: 'User Reaction deleted.' });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.createCommentUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const commentId = req.body.commentId;
  const postId = req.body.postId;
  // const userId = 'someUserId';
  // const commentId = 'someCommentId';

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const comment = Comment.findById(comment);
    // if (!comment) {
    //   const error = new Error('Comment not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;

    const existingReaction = await UserReaction.findOne({
      userId: userId,
      commentId: commentId,
      postId: postId,
      typeIdNumber: typeIdNumber,
    });

    if (existingReaction) {
      const error = new Error('The User Reaction already exist.');
      error.statusCode = 400;
      throw error;
    }

    userReaction = new UserReaction({
      userId: userId,
      commentId: commentId,
      postId: postId,
      typeIdNumber: typeIdNumber,
    });

    await userReaction.save();


    
    // if (userId) {
    //   const existingReaction = await UserReaction.findOne({
    //     userId: userId,
    //     commentId: commentId,
    //     postId: postId,
    //     typeIdNumber: typeIdNumber,
    //   });

    //   if (existingReaction) {
    //     const error = new Error('The User Reaction already exist.');
    //     error.statusCode = 400;
    //     throw error;
    //   }

    //   userReaction = await UserReaction.findOne({
    //     userId: userId,
    //     commentId: commentId,
    //     postId: postId,
    //     typeIdNumber: typeIdNumber,
    //   });

    // }
    // else {
    //   userReaction = new UserReaction({
    //     userId: '',
    //     commentId: commentId,
    //     postId: postId,
    //     typeIdNumber: typeIdNumber
    //   });
    // }

    // await userReaction.save();

    res.status(200).json({ message: 'User Comment Reaction Created.', data: userReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.getPostCommentUserReactions = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const postId = req.body.postId;

  try {

    let userReaction;

    if (type) {
      const userReactionType = await UserReactionType.findOne({ type: type });

      if (!userReactionType) {
        const error = new Error('User Reaction Type not exist.');
        error.statusCode = 400;
        throw error;
      }
  
      const typeIdNumber = userReactionType.typeIdNumber;

      userReaction = await UserReaction.find({
        postId: postId,
        typeIdNumber: typeIdNumber,
      });
    } 
    else {
      userReaction = await UserReaction.find({
        postId: postId,
      });
    }

    const commentReaction = userReaction.filter(reaction => {
      return reaction.commentId;
    });

    // console.log('userReaction', userReaction);

    res.status(200).json({ message: 'Post comment User Reactions found.', data: commentReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.getCommentUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const commentId = req.body.commentId;

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const comment = Post.findById(commentId);
    // if (!comment) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;
    userReaction = await UserReaction.find({
      // userId: userId,
      commentId: commentId,
      typeIdNumber: typeIdNumber,
    });

    // if (!userReaction) {
    //   const error = new Error('The User Reaction not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    res.status(200).json({ message: 'User Reaction found.', data: userReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteCommentUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const commentId = req.body.commentId;

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const comment = Post.findById(commentId);
    // if (!comment) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;
    userReaction = await UserReaction.findOne({
      userId: userId,
      commentId: commentId,
      typeIdNumber: typeIdNumber,
    });

    if (!userReaction) {
      const error = new Error('The User Reaction not found.');
      error.statusCode = 404;
      throw error;
    }

    const deletedReaction = await userReaction.deleteOne({
      userId: userId,
      commentId: commentId,
      typeIdNumber: typeIdNumber,
    });

    res.status(200).json({ message: 'User Reaction deleted.' });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.createGroupTalkTextUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const textId = req.body.textId;
  // const userId = 'someUserId';
  // const textId = 'someGTextId';

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const comment = Comment.findById(comment);
    // if (!comment) {
    //   const error = new Error('Comment not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;
    userReaction = await UserReaction.findOne({
      userId: userId,
      groupTalkTextId: textId,
      typeIdNumber: typeIdNumber,
    });

    if (userReaction) {
      const error = new Error('The User Reaction already exist.');
      error.statusCode = 400;
      throw error;
    }

    userReaction = new UserReaction({
      userId: userId,
      groupTalkTextId: textId,
      typeIdNumber: typeIdNumber
    });

    await userReaction.save();

    res.status(200).json({ message: 'User Reaction Created.', data: userReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getGroupTalkTextUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const textId = req.body.textId;

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const comment = Post.findById(commentId);
    // if (!comment) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;
    userReaction = await UserReaction.find({
      // userId: userId,
      groupTalkTextId: textId,
      typeIdNumber: typeIdNumber,
    });

    // if (!userReaction) {
    //   const error = new Error('The User Reaction not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    res.status(200).json({ message: 'User Reaction found.', data: userReaction });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteGroupTalkTextUserReaction = async (req, res, next) => {
  // console.log('req.body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const type = req.body.type;
  const userId = req.userId;
  const textId = req.body.textId;

  // const commentId = req.body.commentId;
  // const reactionRcvUserId = req.body.reactionRcvUserId;
  // const groupTalkTextId = req.body.groupTalkTextId;

  try {
    // const comment = Post.findById(commentId);
    // if (!comment) {
    //   const error = new Error('Post not found.');
    //   error.statusCode = 404;
    //   throw error;
    // }

    const userReactionType = await UserReactionType.findOne({ type: type });

    if (!userReactionType) {
      const error = new Error('User Reaction Type not exist.');
      error.statusCode = 400;
      throw error;
    }

    const typeIdNumber = userReactionType.typeIdNumber;

    let userReaction;
    userReaction = await UserReaction.findOne({
      userId: userId,
      groupTalkTextId: textId,
      typeIdNumber: typeIdNumber,
    });

    if (!userReaction) {
      const error = new Error('The User Reaction not found.');
      error.statusCode = 404;
      throw error;
    }

    const deletedReaction = await userReaction.deleteOne({
      userId: userId,
      groupTalkTextId: textId,
      typeIdNumber: typeIdNumber,
    });

    res.status(200).json({ message: 'User Reaction deleted.' });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
