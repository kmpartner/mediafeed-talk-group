const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentPushSchema = Schema({
  pushTime: {
    type: Number,
  },
  pushContent: {
    type: Object
  },
  pushUserIds: [{
    type: String
  }],
  clientUserId: {
    type: String
  },
  description: {
    type: String
  },
  other: {
    type: String
  },
  other2: {
    type: String
  },
}, 
{ timestamps: true }
);

module.exports = mongoose.model('commentPush', commentPushSchema);