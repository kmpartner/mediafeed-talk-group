const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerTableSchema = Schema({
  userId: {
    type: String, 
    required: true
  },
  user_id: {
    type: String, 
  },
  followingUserId: {
    type: String, 
    required: true
  },
  // followingUser_id: {
  //   type: String, 
  //   required: true
  // },
  // followedUserIds: [{
  //   type: String
  // }],

},
  { timestamps: true }
);

module.exports = mongoose.model('FollowerTable', followerTableSchema);