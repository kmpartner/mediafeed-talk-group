const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
    content: {
        type: String,
        required: true
    },
    // creator: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     // required: true
    // },
    creatorId: {
        // type: Schema.Types.ObjectId,
        type: String,
        // ref: 'User',
        required: true
    },
    creator_id: {
        type: String,
    },
    creatorName: {
        type: String,
        // required: true
    },
    creatorImageUrl: {
        type: String,
        default: null
        // required: true
    },
    postId: {
        // type: Schema.Types.ObjectId,
        type: String,
        // ref: 'Post',
        required: true
    },
    parentCommentId: {
        type: Schema.Types.ObjectId, // keep to accept null?
        ref: 'Comment',
        required: false
    },
    acceptLanguage: {
        type: String,
        // required: true
    },
    geolocation: {
        type: Object,
        // required: true
    },
    headers: {
        type: Object
    },
}, 
{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);