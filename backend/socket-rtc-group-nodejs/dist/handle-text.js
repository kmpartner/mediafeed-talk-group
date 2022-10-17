"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GroupTalk = require('./models/group-talk');
const GroupTalkReaction = require('./models/group-talk-reaction');
const { authUserId } = require('./util/auth');
const mongoose_1 = require("mongoose");
exports.handleGroupTextSend = (socket) => {
    socket.on('group-text-send', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('group-text-send, data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId || data.fromUserId !== jwtUserId) {
                const error = new mongoose_1.Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            const groupTalk = yield GroupTalk.findOne({
                _id: data.groupRoomId
            });
            if (!groupTalk) {
                const error = new mongoose_1.Error('group talk data not found');
                // error.name = 'authError';
                throw error;
            }
            // console.log('groupTalk', groupTalk);
            const textData = {
                from: data.from,
                fromUserId: data.fromUserId,
                text: data.text,
                fromName: data.fromName,
                groupRoomId: data.groupRoomId,
                sendAt: data.sendAt,
                language: data.language,
                geolocation: data.geolocation,
            };
            groupTalk.talks.push(textData);
            yield groupTalk.save();
            // const group = this.activeGroups.find((element: any) => {
            //   return element.groupRoomId = data.groupRoomId;
            // });
            const groupObj = {
                _id: groupTalk._id,
                creatorUserId: groupTalk.creatorUserId,
                groupName: groupTalk.groupName,
                description: groupTalk.description,
                createdAt: groupTalk.createdAt,
                talks: groupTalk.talks,
                allMemberUserIds: groupTalk.allMemberUserIds,
                language: groupTalk.language,
                keywords: groupTalk.keywords,
                tags: groupTalk.tags,
                totalVisits: groupTalk.totalVisits,
                // groupRoomId: group.groupRoomId,
                groupRoomId: groupTalk.groupRoomId,
            };
            socket.emit('update-group', {
                group: groupObj,
            });
            socket.to(data.groupRoomId).emit('update-group', {
                group: groupObj,
            });
            const idsForPush = [];
            for (const ele of groupTalk.allMemberUserIds) {
                if (ele.userId !== data.fromUserId) {
                    idsForPush.push(ele.userId);
                }
            }
            // const textData: GroupTextInfo = {
            //     from: data.from,
            //     fromUserId: data.fromUserId,
            //     text: data.text,
            //     fromName: data.fromName,
            //     groupRoomId: data.groupRoomId,
            //     sendAt: data.sendAt,
            //     language: data.language,
            //     geolocation: data.geolocation,
            // };
            // const textData = {
            //   ...data,
            //   token: null,
            // }
            socket.emit('group-text-send-result', {
                message: 'group text send success',
                idsForPush: idsForPush,
                textData: textData
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('group-text-send-result', {
                message: 'group text send failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
exports.handleGroupTextDelete = (socket) => {
    socket.on('group-text-delete', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('group-text-delete, data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId || data.user.userId !== jwtUserId) {
                const error = new mongoose_1.Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            const groupTalk = yield GroupTalk.findOne({
                _id: data.groupRoomId
            });
            if (!groupTalk) {
                const error = new mongoose_1.Error('group talk data not found');
                // error.name = 'authError';
                throw error;
            }
            const talkData = yield GroupTalk
                .findOne({ _id: data.groupRoomId })
                .select({ talks: { $elemMatch: { _id: data.groupTalkTextId } } });
            if (!talkData || !talkData.talks || talkData.talks.length === 0) {
                const error = new mongoose_1.Error('talk data not found');
                // error.name = 'authError';
                throw error;
            }
            const talkDataFromUserId = talkData.talks[0].fromUserId;
            // console.log(talkData);
            // console.log('fromUserId in talkData', talkDataFromUserId);
            if (talkDataFromUserId !== data.user.userId) {
                const error = new mongoose_1.Error('request user is diffrent from text created user');
                // error.name = 'authError';
                throw error;
            }
            groupTalk.talks.pull({ _id: data.groupTalkTextId });
            yield groupTalk.save();
            const groupObj = {
                _id: groupTalk._id,
                creatorUserId: groupTalk.creatorUserId,
                groupName: groupTalk.groupName,
                description: groupTalk.description,
                createdAt: groupTalk.createdAt,
                talks: groupTalk.talks,
                allMemberUserIds: groupTalk.allMemberUserIds,
                language: groupTalk.language,
                keywords: groupTalk.keywords,
                tags: groupTalk.tags,
                totalVisits: groupTalk.totalVisits,
                // groupRoomId: group.groupRoomId,
                groupRoomId: groupTalk.groupRoomId,
            };
            socket.emit('update-group', {
                group: groupObj,
            });
            socket.to(data.groupRoomId).emit('update-group', {
                group: groupObj,
            });
            socket.emit('group-text-delete-result', {
                message: 'group text delete success',
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('group-text-delete-result', {
                message: 'group text delete failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
exports.handleCreateGroupTextReaction = (socket) => {
    socket.on('create-group-text-reaction', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('create-group-text-reaction, data', data);
        try {
            // const jwtUserId = await authUserId(data.token);
            // if (!jwtUserId || data.userId !== jwtUserId) {
            //   const error = new Error('Error, not authenticated');
            //   error.name = 'authError';
            //   throw error;
            // }
            // const groupTalk = await GroupTalk.findOne({
            //   _id: data.groupRoomId
            // });
            // console.log('groupTalk', groupTalk);
            const reactionData = new GroupTalkReaction({
                userId: data.userId,
                groupRoomId: data.groupRoomId,
                groupTalkTextId: data.groupTalkTextId,
                type: data.type,
            });
            yield reactionData.save();
            socket.emit('create-group-text-reaction-result', {
                message: 'create group text reaction success',
                reactionData: reactionData,
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('create-group-text-reaction-result', {
                message: 'create group text reaction failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
exports.handleGetGroupTextReactions = (socket) => {
    socket.on('get-group-text-reactions', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('get-group-text-reactions, data', data);
        try {
            // const jwtUserId = await authUserId(data.token);
            // if (!jwtUserId || data.userId !== jwtUserId) {
            //   const error = new Error('Error, not authenticated');
            //   error.name = 'authError';
            //   throw error;
            // }
            const groupRoomReactions = yield GroupTalkReaction.find({
                groupRoomId: data.groupRoomId,
            });
            socket.emit('get-group-text-reactions-result', {
                message: 'get group text reactions success',
                // idsForPush: idsForPush,
                groupRoomReactions: groupRoomReactions,
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('get-group-text-reactions-result', {
                message: 'get group text reactions failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
