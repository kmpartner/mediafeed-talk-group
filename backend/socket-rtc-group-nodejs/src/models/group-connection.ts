export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupConnectionSchema = Schema({
  userId: { type: String},
  socketId: { type: String },
  connectAt: { type: Number },
  disconnectAt: { type: Number },
  // callTo: [{
  //     socketId: { type: String },
  //     userId: { type: String },
  //     userName: { typ: String },
  //     connectAt: { type: Number },
  //     talkStartAt: { type: Number },
  //     disconnectAt: { type: Number },
  //     createAt: { type: Number },
  // }],
},
  { timestamps: true }
);

module.exports = mongoose.model('GroupConnection', groupConnectionSchema);