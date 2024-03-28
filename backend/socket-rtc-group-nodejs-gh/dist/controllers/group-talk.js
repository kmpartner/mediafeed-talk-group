"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const TextTalk = require('../models/text-talk');
// const { Request, Response, NextFunction} = require('express')
// const db = require('../db');
exports.getTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: 'get success' });
});
// exports.getTextTalk = async (req: any, res: any, next: any) => {
//   // console.log('req.query', req.query);
//   const fromUserId = req.query.fromUserId;
//   const toUserId = req.query.toUserId;
//   const textTalk = await TextTalk.findOne({
//     userId: fromUserId,
//     'talk.pairId': `${fromUserId}-${toUserId}`
//   });
//   // console.log('textTalk', textTalk);
//   if (!textTalk) {
//     // const error = new Error('Could not find text talk.');
//     // error.statusCode = 404;
//     // throw error;
//     res.status(404).json({ message: 'text talk not found' });
//   }
//   const textList = textTalk.talk[0].text
//   res.status(200).json({ message: 'text talk found', data: textList });
// }
// exports.getUserTextTalks = async (req: any, res: any, next: any) => {
//   const userId = req.query.userId;
//   const textTalks = await TextTalk.find({ userId: userId });
//   if (!textTalks) {
//     // const error = new Error('Could not find text talk.');
//     // error.statusCode = 404;
//     // throw error;
//     res.status(404).json({ message: 'user text talks not found' });
//   }
//   const textList = textTalks[0].talk;
//   // console.log('textList', textList);
//   res.status(200).json({ message: 'user text talks found', data: textList });
// }
// exports.postTextTalk = async (req, res, next) => {
//   const data = req.body;
//   console.log('req.body', req.body);
//   let textTalkOne;
//   let textTalkTwo;
//   textTalkOne = await TextTalk.findOne({
//     userId: data.fromUserId,
//     'talk.pairId': `${data.fromUserId}-${data.toUserId}`
//   });
//   if (!textTalkOne) {
//     textTalkOne = await new TextTalk({
//       userId: data.fromUserId,
//       talk: {
//         pairId: `${data.fromUserId}-${data.toUserId}`,
//         text: []
//       }
//     })
//   }
//   textTalkTwo = await TextTalk.findOne({
//     userId: data.toUserId,
//     'talk.pairId': `${data.toUserId}-${data.fromUserId}`
//   });
//   if (!textTalkTwo) {
//     textTalkTwo = await new TextTalk({
//       userId: data.toUserId,
//       talk: {
//         pairId: `${data.toUserId}-${data.fromUserId}`,
//         text: []
//       }
//     })
//   }
//   // console.log('textTalkOne.talk',textTalkOne.talk);
//   // console.log('textTalkTwo.talk', textTalkTwo.talk);
//   textTalkOne.talk[0].text.push(data);
//   textTalkTwo.talk[0].text.push(data);
//   // console.log('textTalkOne', textTalkOne);
//   await textTalkOne.save();
//   await textTalkTwo.save();
//   res.status(201).json({ message: 'text talk posted', data: data });
// }
// exports.deleteTextTalk = async (req, res, next) => {
//   const textId = req.query.textId;
//   const toUserId = req.query.toUserId;
//   const fromUserId = req.query.fromUserId;
//   console.log('textId', textId);
//   console.log('req.query', textId, toUserId, fromUserId);
//   let textTalkOne;
//   let textTalkTwo;
//   try {
//     textTalkOne = await TextTalk.findOne({
//       userId: toUserId,
//       'talk.pairId': `${toUserId}-${fromUserId}`,
//     });
//     console.log('testTalkOne', textTalkOne);
//     console.log('testTalkOne.talk[0].text', textTalkOne.talk[0].text);
//     console.log('textTalkOne.talk[0]', textTalkOne.talk[0]);
//     console.log('textId', textId, req.query.textId);
//     const talk = await textTalkOne.talk[0];
//     console.log('talk', talk);
//     console.log('textTalkOne.talk[0].text[0]', textTalkOne.talk[0].text[0]);
//     console.log('typeof(textTalkOne.talk[0].text)', typeof(textTalkOne.talk[0].text))
//     const textIdIndex = textTalkOne.talk[0].text.findIndex(element => {
//       return element._id === textId;
//     });
//     console.log('textIdIndex', textIdIndex);
//     // textTalkOne.talk[0].text.find(function(err, element) {
//     //   if (err) {
//     //     console.log(err);
//     //   }
//     //   console.log('element', element);
//     // });    
//     // const test = await textTalkOne.talk[0].text.id(textId);
//     // console.log('textTalkOne of _id', test);
//     // console.log('test2', await textTalkOne.talk[0].text.id({ fromUserId: fromUserId }));
//   } catch (err) {
//     if (!err.statusCode) {
//       console.log(err);
//       err.statusCode = 500;
//   }
//   next(err);
//   }
// }
