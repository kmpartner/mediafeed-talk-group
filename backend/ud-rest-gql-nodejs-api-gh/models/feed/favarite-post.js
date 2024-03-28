const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoritePostSchema = Schema({
  postId: {
    type: String, 
    required: true
  },
  // postCreatorUserId: {
  //   type: String, 
  //   required: true
  // },
  userId: {
    type: String, 
    required: true
  },
  user_id: {
    type: String, 
  }
  // followedUserIds: [{
  //   type: String
  // }],

},
  { timestamps: true }
);

module.exports = mongoose.model('FavoritePost', favoritePostSchema);