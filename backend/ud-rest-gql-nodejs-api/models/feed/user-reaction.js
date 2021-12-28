const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserReactionSchema = Schema({
  userId: {
    type: String, 
    // required: true
  },
  user_id: {
    type: String, 
  },
  postId: {
    type: String, 
    // required: true
  },
  commentId: {
    type: String,
    // required: true
  },
  // reactionRcvUserId: {
  //   type: String, 
  //   // required: true
  // },
  groupTalkTextId: {
    type: String, 
    // required: true
  },
  typeIdNumber: {
    type: Number
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('UserReaction', UserReactionSchema);