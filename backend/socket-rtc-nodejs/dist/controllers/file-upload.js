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
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // // console.log('req.query', req.query);
    // const fromUserId = req.query.fromUserId;
    // const toUserId = req.query.toUserId;
    // const textTalk = await TextTalk.findOne({
    //   userId: fromUserId,
    //   'talk.pairId': `${fromUserId}-${toUserId}`
    // });
    // // console.log('textTalk', textTalk);
    // if (!textTalk) {
    //   // const error = new Error('Could not find text talk.');
    //   // error.statusCode = 404;
    //   // throw error;
    //   res.status(404).json({ message: 'text talk not found' });
    // }
    const returnData = 'file-upload-data';
    // const textList = textTalk.talk[0].text
    res.status(200).json({ message: 'file uploaded', data: returnData });
});
module.exports = {
    fileUpload,
};
