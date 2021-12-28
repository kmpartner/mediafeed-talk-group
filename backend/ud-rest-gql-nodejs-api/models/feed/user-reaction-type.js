const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserReactionTypeSchema = Schema({
  type: {
    type: String, 
    required: true,
  },
  typeIdNumber: {
    type: Number,
    required: true
  }

},
  { timestamps: true }
);

module.exports = mongoose.model('UserReactionType', UserReactionTypeSchema);