"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupTextSchema = {
    text: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    fromUserId: {
        type: String,
        required: true
    },
    fromName: {
        type: String,
    },
    groupRoomId: {
        type: String,
        required: true
    },
    sendAt: {
        type: Number,
        required: true
    },
    language: {
        type: String,
    },
    geolocation: {
        type: Object
    },
};
const groupTalkSchema = Schema({
    creatorUserId: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    allMemberUserIds: [{
            // type: String
            userId: {
                type: String
            },
            addAt: {
                type: Number
            }
        }],
    // currentMembers: [{
    //   type: String
    // }],
    talks: [groupTextSchema],
    description: {
        type: String
    },
}, { timestamps: true });
module.exports = mongoose.model('GroupTalk', groupTalkSchema);
