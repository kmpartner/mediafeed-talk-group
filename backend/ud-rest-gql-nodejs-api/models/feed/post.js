const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        // required: true
    },
    modifiedImageUrl: {
        type: String,
        // required: true
    },
    thumbnailImageUrl: {
        type: String,
        // required: true
    },
    imagePath: {
        type: String,
        // required: true
    },

    imageUrls: [{ type: String }],
    modifiedImageUrls: [{ type: String }],
    thumbnailImageUrls: [{ type: String }],
    imagePaths: [{ type: String }],
    modifiedImagePaths: [{ type: String }],
    thumbnailImagePaths: [{ type: String }],

    content: {
        type: String,
        required: true
    },
    embedUrl : { type: String },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
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
    b64Simage: {
        type: String,
        // required: true
    },
    public: {
        type: String,
        required: true
    },
    language: {
        type: String,
        // required: true
    },
    // likeNumber: { type: Number, default: 0 },
    // visitNumber: {
    //     type: Number,
    //     default: 0,
    //     // required: true
    // },
    totalVisit: { type: Number, default: 0 },
    userReactionCounts: [{
        type: { type: String },
        typeIdNumber: { type: String },
        reactionCount: { type: Number },
    }],
    totalComment: { type: Number, default: 0 },
    // visit: {
    //     details : [{
    //         userId: { type: String },
    //         geolocation: { type: Object },
    //         headers: { type: Object },
    //     }],
    //     acceptLanguage: [{
    //         name: { type: String },
    //         number: { type: Number, default: 0 }
    //     }],
    //     totalVisit: { type: Number, default: 0 },
    // },
    geolocation: {
        type: Object
    },
    // lastUpdateTime: {
    //     type: Number
    // },
    // UpdateTimes: [{
    //     type: Number
    // }],
    // geolocation: {
    //     type: String,
    //     // required: true
    // },
    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
}, 
{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);