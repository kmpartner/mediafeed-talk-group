export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupVisitSchema = Schema({
  groupRoomId: { type: String },
  userId: { type: String },
  language: { type: String },
  geolocation: { type: Object },
  userAgent: { type: String },
},
  { timestamps: true }
);

module.exports = mongoose.model('GroupVisit', groupVisitSchema);