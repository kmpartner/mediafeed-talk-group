const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recentVisitSchema = new Schema({
    userId: { type: String },
    recentVisitPostIds: [{ 
      postId: { type: String },
      creatorId: { type: String },
      time: { type: Number },
    }],
    recentVisitGroupIds: [{ 
      groupId: { type: String },
      creatorId: { type: String },
      time: { type: Number },
    }],
    recentVisitTalkUserIds: [{ 
      userId: { type: String },
      time: { type: Number },
    }],
    ////
    ////
},
{ timestamps: true }
)

module.exports = mongoose.model('RecentVisit', recentVisitSchema);