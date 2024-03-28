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
const { authUserId } = require('./util/auth');
exports.handleDeleteGroupMember = (socket) => {
    socket.on('delete-group-member', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('delete-group-member, data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId) {
                const error = new Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            const groupTalk = yield GroupTalk.findOne({
                _id: data.groupRoomId
            });
            // console.log(data.deleteUserId, jwtUserId);
            if (jwtUserId !== data.deleteUserId && data.user.userId !== groupTalk.creatorUserId) {
                throw new Error('not authenticated, user or group creator can delete');
            }
            if (groupTalk.creatorUserId === data.deleteUserId) {
                throw new Error('cannot delete group creator');
            }
            // const group = this.activeGroups.find(element => {
            //   return element.groupRoomId = data.groupRoomId;
            // });
            // console.log('groupTalk.allMemberUserIds', groupTalk.allMemberUserIds)
            const withoutUserAllMemberIds = groupTalk.allMemberUserIds.filter((element) => {
                return element.userId !== data.deleteUserId;
            });
            // console.log('withoutUserAllMemberIds', withoutUserAllMemberIds)
            groupTalk.allMemberUserIds = withoutUserAllMemberIds;
            yield groupTalk.save();
            // const groupObj: groupElement = {
            //   _id: groupTalk._id,
            //   creatorUserId: groupTalk.creatorUserId,
            //   groupName: groupTalk.groupName,
            //   description: groupTalk.description,
            //   createdAt: groupTalk.createdAt,
            //   talks: groupTalk.talks,
            //   allMemberUserIds: withoutUserAllMemberIds,
            //   language: groupTalk.language,
            //   keywords: groupTalk.keywords,
            //   tags: groupTalk.tags,
            //   totalVisits: groupTalk.totalVisits,
            //   groupRoomId: groupTalk.groupRoomId,
            //   // groupRoomId: group.groupRoomId,
            //   // members: group.members,
            // };
            socket.emit('delete-group-member-result', {
                // action: 'delete-group-member',
                message: 'delete member success',
            });
            // socket.to(data.groupRoomId).emit('update-group', {
            //   group: groupObj,
            // });
        }
        catch (err) {
            console.log(err);
            socket.emit('delete-group-member-result', {
                // action: 'delete-group-member',
                message: err.message,
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
