const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postUserVisitSchema = Schema({
    postId: {
      type:String,
      required: true
    },
    userId: { type: String },
    language: { type: String },
    userAgent: { type: String },
    geolocation: { type: Object },
    time: { type: Number },

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

module.exports = mongoose.model('PostUserVisit', postUserVisitSchema);