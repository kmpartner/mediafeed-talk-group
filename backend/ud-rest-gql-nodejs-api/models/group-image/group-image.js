const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupImageSchema = new Schema({
    groupRoomId: {
        type: String
    },
    imageUrl: {
        type: String,
        // required: true
    },
    imagePath: {
        type: String,
        // required: true
    },
},
{ timestamps: true }
)

module.exports = mongoose.model('GroupImage', groupImageSchema);