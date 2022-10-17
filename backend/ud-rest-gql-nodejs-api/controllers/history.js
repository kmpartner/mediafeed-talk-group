const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');

const History = require('../models/history');
const User = require('../models/user/user');
const Post = require('../models/feed/post');
const Comment = require('../models/feed/comment');
const { clearImage } = require('../util/file');
const imageModify = require('../util/image');
const { createSmallUserImage, s3Upload, s3DeleteMany, s3DeleteOne } = require('../util/image');

require('dotenv').config();



exports.putBrowserHistory = async (req, res, next) => {
  const historyData = req.body;
  // console.log('historyData', historyData);

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     const error = new Error('Validation failed, entered data incorrect.');
  //     error.statusCode = 422;
  //     throw error;
  // }

  if (historyData.length === 0) {
    return;
  }

  let userHistory;
  let userId;

  if (!historyData[historyData.length -1].userId) {
    return;
  }

  if (historyData[historyData.length -1].userId) {
    userId = historyData[historyData.length -1].userId
  }


  try {

    userHistory = await History.findOne({ userId: userId });
    // console.log('userHistory', userHistory);
  
    if (!userHistory) {
  
      if (userId) {
        userHistory = await new History({
          userId: userId,
          browserHistory: []
        }); 
        userHistory.save();
      } else {
        //...
        const error = new Error('no userId provided for put history.');
        error.statusCode = 400;
        throw error;
  
        //... inplement ..
      }
  
    } else {

      let existingHistory
      existingHistory = userHistory.browserHistory.find(element => {
        return element.startTime === historyData[historyData.length -1].startTime;
      });
      if (existingHistory && existingHistory.historyList) {
        // console.log('existingHistory.historyList.lenght', existingHistory.historyList.length);
      }
    
      if (existingHistory) {
        existingHistory.historyList = historyData;
        // existingHistory = {
        //   startTime: historyData[historyData.length -1].startTime,
        //   historyList : historyData
        // };
        await userHistory.save();

      } else {
        userHistory.browserHistory.push({
          startTime: historyData[historyData.length -1].startTime,
          historyList : historyData
        });
        await userHistory.save();
      }
    }
  
    res.status(201).json({ message: 'Put history Success', data: { 
      lastHistory: historyData[historyData.length -1],
      historyLength: historyData.length
    } 
  });
  
  }
  catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
  }

}


