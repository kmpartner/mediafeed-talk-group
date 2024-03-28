"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupTalkReactionSchema = Schema({
    userId: {
        type: String,
    },
    groupRoomId: {
        type: String,
    },
    groupTalkTextId: {
        type: String,
    },
    type: {
        type: String
    },
}, { timestamps: true });
module.exports = mongoose.model('GroupTalkReaction', GroupTalkReactionSchema);
