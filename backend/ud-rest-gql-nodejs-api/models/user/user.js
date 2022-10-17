const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    resetToken: { 
        type: String 
    },
    resetTokenExpiration: {
        type: Number
    },
    status: {
        type: String,
        default: 'I am new!'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    imageUrl: {
        type: String,
        // required: true
    },
    imagePath: {
        type: String,
        // required: true
    },
    description: {
        type: String
    },
    lastLoginDate: {
        type: String,
        // required: true
    }, 
    lastLoginAgent: {
        type: String,
        // required: true
    },
    acceptLanguage: {
        type: String,
        // required: true
    },
    firebaseData: {
        user: {
            type: Object
        },
        additionalUserInfo: {
            type: Object
        }
    },
    // firebaseProviderId: {
    //     type: String
    // },
    // geolocation: {
    //     type: Object,
    //     required: false
    // },
    geolocation: {
        coords: {
            latitude: { type: Number },
            longitude: { type: Number },
            altitude: { type: Number },
            accuracy: { type: Number },
            altitudeAccuracy: { type: Number },
            heading: { type: Number },
            speed: { type: Number },
        },
        timestamp: { type: Number },
    },
    userColor: { type: String },
    followingUserIds: [{
        userId: { type: String },
    }],

    // talkRequestUserIds: [{
    //     userId: { type: String },
    // }],
    // talkAcceptUserIds: [{
    //     userId: { type: String },
    // }],  
    // talkDenyUserIds: [{
    //     userId: { type: String },
    // }],
},
{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema);