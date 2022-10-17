const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pushSubscriptionSchema = Schema({
  subscription: {
    type: Object
  },
  userId: {
    type: String
  },
  updateTime: {
    type: Number
  },
  disabled: {
    type: Boolean
  },
  messageNotify: {
    type: Boolean
  },
  talkNotify: {
    type: Boolean
  },
  subUserAgent: {
    type: String
  }
  // title: {
  //     type: String,
  //     required: true
  // },

  
},
  { timestamps: true }
);

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);