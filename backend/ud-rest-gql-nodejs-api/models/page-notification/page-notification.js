const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageNotificationSchema = new Schema(
  {
    userId: { type: String },
    lastOpenTime: { type: Number },
    // lastGetTime: { type: Number },
    pageNotificationList: [{
      // time: { type: Number },
      page: { type: String },
      title: { type: String },
      message: { type: String },
      dataForNotification: { type: Object },  //// other additional info ...
      readState: { type: String },  //// 'read', ...
      readTime: { type: Number },
      canDisplay: { type: Boolean }, 
      dbInfo: {
        dataId: { type: String }, //// _id of stored data if present
        schema: { type: String },  //// ref for data from config
      },
      creationTime: { type: Number },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageNotification', PageNotificationSchema);