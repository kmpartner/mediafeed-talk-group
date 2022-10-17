const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = Schema({
  userId: {
    type: String, 
    required: true
  },
  followingUsers: [{
    userId: { type: String, required: true },
    addAt: { type: Number }
  }],
  favoritePosts: [{
    postId: { type: String, required: true },
    addAt: { type: Number }
  }],
  // followedUserIds: [{
  //   type: String
  // }],

},
  { timestamps: true }
);

module.exports = mongoose.model('Follow', followSchema);