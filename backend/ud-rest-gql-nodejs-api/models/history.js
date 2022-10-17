const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  userId: {
    type: String,
    // required: true
  },
  browserHistory: [{
    startTime: { type: Number },
    historyList : [{
      action: { type: String },
      location: { type: Object },
      pathname: { type: String },
      time: { type: Number },
      startTime: { type: Number },
      userId: { type: String },
    }]
  }],

},
  { timestamps: true }
)

module.exports = mongoose.model('History', historySchema);