const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupTextSchema = {
  text: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  fromUserId: {
    type: String,
    required: true
  },
  fromName: {
    type: String,
    // required: true
  },
  groupRoomId: {
    type: String,
    required: true
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
}


const groupTalkSchema = Schema({
  creatorUserId: {
    type: String,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  allMemberUserIds: [{
    // type: String
    userId : { 
      type: String 
    },
    addAt: { 
      type: Number 
    }
  }],
  // currentMembers: [{
  //   type: String
  // }],
  talks: [groupTextSchema],
  description: {
    type: String
  },
  language: { 
    type: String, 
    // required: true 
  },
  keywords: [{ 
    type: String 
  }],
  tags: [{ 
    type: String 
  }],
  category: { 
    type: String, 
  },
  groupImageUrl: {
    type: String
  },
  totalVisits: { type: Number, default: 0 },
  
  // connection: [
  //   {
  //     socketId: { type: String },
  //     connectAt: { type: Number },
  //     disconnectAt: { type: Number },
  //     callTo: [{
  //         socketId: { type: String },
  //         userId: { type: String },
  //         userName: { typ: String },
  //         connectAt: { type: Number },
  //         talkStartAt: { type: Number },
  //         disconnectAt: { type: Number },
  //         createAt: { type: Number },
  //       }],
  //   }
  // ]

},
  { timestamps: true }
);

module.exports = mongoose.model('GroupTalk', groupTalkSchema);