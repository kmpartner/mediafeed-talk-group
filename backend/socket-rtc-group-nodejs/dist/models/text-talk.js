"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const textSchema = {
    text: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
    },
    fromUserId: {
        type: String,
        required: true
    },
    toUserId: {
        type: String,
        required: true
    },
    fromName: {
        type: String,
    },
    toName: {
        type: String,
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
const textTalkSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    talk: [
        {
            pairId: { type: String },
            text: [textSchema]
        }
    ],
    connection: [
        {
            socketId: { type: String },
            connectAt: { type: Number },
            disconnectAt: { type: Number },
            callTo: [{
                    socketId: { type: String },
                    userId: { type: String },
                    userName: { typ: String },
                    connectAt: { type: Number },
                    talkStartAt: { type: Number },
                    disconnectAt: { type: Number },
                    createAt: { type: Number },
                }],
        }
    ]
}, { timestamps: true });
module.exports = mongoose.model('TextTalk', textTalkSchema);
