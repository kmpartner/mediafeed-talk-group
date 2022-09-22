export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textSchema = {
  text: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    // required: true
  },
  fromUserId: {
    type: String,
    required: true
  },
  toUserId: {
    type: String,
    required: true
  },
  fromName: {
    type: String,
    // required: true
  },
  toName: {
    type: String,
    // required: true
  },
  sendAt: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    // required: true
  },
  geolocation: {
    type: Object
  },
  
  fileUrls: [{
    type: String,
  }],
  filePaths: [{
    type: String,
  }],
  // miniFileUrls: [{
  //   typ: String,
  // }],
  // miniFilePaths: [{
  //   typ: String,
  // }],
}


const textTalkSchema = Schema({
  userId: {
    type: String,
    required: true
  },
  favoriteTalkUsers: [{
    userId: { type: String },
    addAt: { type: Number },
  }],
  talk: [
    {
      pairId: { type: String },
      text: [textSchema]
    }
  ],
  connection: [
    {
      socketId: { type: String },
      connectAt: { type: Number },
      disconnectAt: { type: Number },
      callTo: [{
          socketId: { type: String },
          userId: { type: String },
          userName: { typ: String },
          connectAt: { type: Number },
          talkStartAt: { type: Number },
          disconnectAt: { type: Number },
          createAt: { type: Number },
        }],
    }
  ]

},
  { timestamps: true }
);

module.exports = mongoose.model('TextTalk', textTalkSchema);