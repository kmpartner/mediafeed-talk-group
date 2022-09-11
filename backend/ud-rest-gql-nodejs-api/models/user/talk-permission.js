const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const talkPermissionSchema = new Schema({
    userId: { type: String },

    talkRequestedUserIds: [{
        userId: { type: String },
        time: { type: Number },
    }],
    talkRequestingUserIds: [{
        userId: { type: String },
        time: { type: Number },
    }],
    talkAcceptUserIds: [{
        userId: { type: String },
        time: { type: Number },
    }],
    talkAcceptedUserIds: [{
        userId: { type: String },
        time: { type: Number },
    }],  
    // talkDenyUserIds: [{
    //     userId: { type: String },
    //     time: { type: Number },
    // }],

    // talkRequestedUserIds: [{ type: String }],
    // talkRequestingUserIds: [{ type: String }],
    // talkAcceptUserIds: [{ type: String }],  
    // talkDenyUserIds: [{ type: String }],

},
{ timestamps: true }
)

module.exports = mongoose.model('TalkPermission', talkPermissionSchema);