"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const talkConnectionSchema = Schema({
    userId: { type: String },
    socketId: { type: String },
    connectAt: { type: Number },
    disconnectAt: { type: Number },
}, { timestamps: true });
module.exports = mongoose.model('TalkConnection', talkConnectionSchema);
