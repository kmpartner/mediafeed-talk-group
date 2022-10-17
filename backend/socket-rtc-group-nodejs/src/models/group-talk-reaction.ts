export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupTalkReactionSchema = Schema({
  userId: {
    type: String, 
    // required: true
  },
  groupRoomId: {
    type: String, 
    // required: true
  },
  groupTalkTextId: {
    type: String, 
    // required: true
  },
  type: {
    type: String
  },
  // reactionRcvUserId: {
  //   type: String, 
  //   // required: true
  // },
},
  { timestamps: true }
);

module.exports = mongoose.model('GroupTalkReaction', GroupTalkReactionSchema);