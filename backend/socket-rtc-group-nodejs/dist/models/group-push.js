"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupPushSchema = Schema({
    pushTime: {
        type: Number,
    },
    pushContent: {
        type: Object
    },
    pushUserIds: [{
            type: String
        }],
    clientUserId: {
        type: String
    },
    description: {
        type: String
    },
    other: {
        type: String
    },
    other2: {
        type: String
    },
}, { timestamps: true });
module.exports = mongoose.model('groupPush', groupPushSchema);
