const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postVisitSchema = Schema({
    postId: {
      type:String,
      required: true
    },
    visit: {
        details : [{
            userId: { type: String },
            geolocation: { type: Object },
            headers: { type: Object },
        }],
        acceptLanguage: [{
            name: { type: String },
            number: { type: Number, default: 0 }
        }],
        // totalVisit: { type: Number, default: 0 },
    },
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

module.exports = mongoose.model('PostVisit', postVisitSchema);