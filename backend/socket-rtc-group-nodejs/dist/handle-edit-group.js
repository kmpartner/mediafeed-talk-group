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
const mongoose_1 = require("mongoose");
const GroupVisit = require('./models/group-visit');
exports.handleEditGroup = (socket) => {
    socket.on('create-group', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('create-group data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId || data.userId !== jwtUserId) {
                const error = new mongoose_1.Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            //// name validation
            if (!data.groupName ||
                data.groupName.length < 5 ||
                data.groupName.length > 100) {
                const error = new mongoose_1.Error('group name should be 5-100 characters length');
                error.name = 'groupNameInputError';
                throw error;
            }
            //// keywords validation
            if (data.keywords && data.keywords.length > 5) {
                const error = new mongoose_1.Error('Too many number of keywords exist, maximum number is 5');
                error.name = 'keywordNumberError';
                throw error;
            }
            if (data.keywords && data.keywords.length > 0) {
                const longKeyword = data.keywords.find((keyword) => {
                    return keyword.length > 20;
                });
                if (longKeyword) {
                    const error = new mongoose_1.Error('Too long keyword exist, maximum 20 characters');
                    error.name = 'keywordLengthError';
                    throw error;
                }
            }
            //// create list for tag
            const tagList = [];
            if (data.keywords && data.keywords.length > 0) {
                for (const word of data.keywords) {
                    tagList.push(word.replace(/\s+/g, ''));
                }
            }
            let newGroup;
            newGroup = yield GroupTalk.findOne({
                creatorUserId: data.userId,
                groupName: data.groupName
            });
            if (newGroup) {
                throw new mongoose_1.Error('Error, group already exist');
            }
            if (!newGroup) {
                newGroup = yield new GroupTalk({
                    creatorUserId: data.userId,
                    groupName: data.groupName,
                    allMemberUserIds: [{
                            userId: data.userId,
                            addAt: Date.now()
                        }],
                    talk: [],
                    language: data.language,
                    keywords: data.keywords,
                    tags: tagList,
                });
                yield newGroup.save();
                socket.emit('create-group-result', {
                    group: newGroup,
                    message: 'group created'
                });
            }
            else {
                throw new mongoose_1.Error('group creation failed. group already exist');
            }
        }
        catch (err) {
            console.log(err);
            socket.emit('create-group-result', {
                // group: '',
                message: err.message,
                error: { message: err.message, name: err.name }
            });
        }
    }));
    socket.on('upgrade-group', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('upgrade-group data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId) {
                const error = new mongoose_1.Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            //// name description validation
            if (!data.newGroupName ||
                data.newGroupName.length < 5 ||
                data.newGroupName.length > 100) {
                const error = new mongoose_1.Error('group name should be 5-100 characters length');
                error.name = 'groupNameInputError';
                throw error;
            }
            if (data.newDescription && data.newDescription.length > 500) {
                const error = new mongoose_1.Error('description should be less than 500 characters length');
                error.name = 'groupDescriptionInputError';
                throw error;
            }
            //// keywords validation
            if (data.newKeywords && data.newKeywords.length > 5) {
                const error = new mongoose_1.Error('Too many number of keywords exist, maximum number is 5');
                error.name = 'keywordNumberError';
                throw error;
            }
            if (data.newKeywords && data.newKeywords.length > 0) {
                const longKeyword = data.newKeywords.find((keyword) => {
                    return keyword.length > 20;
                });
                if (longKeyword) {
                    const error = new mongoose_1.Error('Too long keyword exist, maximum 20 characters');
                    error.name = 'keywordLengthError';
                    throw error;
                }
            }
            //// create list for tag
            const tagList = [];
            if (data.newKeywords && data.newKeywords.length > 0) {
                for (const word of data.newKeywords) {
                    tagList.push(word.replace(/\s+/g, ''));
                }
            }
            const group = yield GroupTalk.findOne({
                creatorUserId: data.userId,
                groupName: data.previousGroupName,
                _id: data.groupRoomId,
            });
            if (!group) {
                throw new mongoose_1.Error('group does not exist');
            }
            if (group.creatorUserId !== jwtUserId) {
                const error = new mongoose_1.Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            else {
                group.groupName = data.newGroupName;
                group.description = data.newDescription;
                group.keywords = data.newKeywords;
                group.tags = tagList;
                yield group.save();
                socket.emit('upgrade-group-result', {
                    // group: '',
                    message: 'group updated',
                });
            }
        }
        catch (err) {
            console.log(err);
            socket.emit('upgrade-group-result', {
                // group: '',
                message: err.message,
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
exports.handleDeleteGroup = (socket) => {
    socket.on('delete-group', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('delete-group, data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId) {
                const error = new mongoose_1.Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            const groupTalk = yield GroupTalk.findOne({
                _id: data.groupRoomId
            });
            if (groupTalk.creatorUserId !== data.user.userId ||
                groupTalk.creatorUserId !== jwtUserId) {
                throw new mongoose_1.Error('deletion failed, only creator can delete group');
            }
            yield GroupTalk.deleteOne({ _id: data.groupRoomId });
            // this.activeGroups = this.activeGroups.filter(element => {
            //   return element.groupRoomId !== data.groupRoomId;
            // });
            // this.io.emit('update-group-list', {
            //   // socket.emit('update-group-list', {
            //     groups: this.activeGroups,
            // });
            socket.emit('delete-group-result', {
                // action: 'delete-group-member',
                message: 'delete group success',
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('delete-group-result', {
                // action: 'delete-group-member',
                message: 'delete group failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
exports.handleGetGroup = (socket) => {
    socket.on('get-group-info', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('get-group-info data', data);
        const groupInfo = yield GroupTalk.findById(data.groupRoomId);
        // console.log('groupInfo', groupInfo);
        // const groupInActiveGroups = this.activeGroups.find(element => {
        //   return element.groupRoomId === data.groupRoomId;
        // });
        const groupObj = {
            _id: groupInfo._id,
            creatorUserId: groupInfo.creatorUserId,
            groupName: groupInfo.groupName,
            description: groupInfo.description,
            createdAt: groupInfo.createdAt,
            talks: groupInfo.talks,
            allMemberUserIds: groupInfo.allMemberUserIds,
            language: groupInfo.language,
            keywords: groupInfo.keywords,
            tags: groupInfo.tags,
            totalVisits: groupInfo.totalVisits,
            groupRoomId: data.groupRoomId,
        };
        socket.emit('update-group', {
            group: groupObj,
        });
        // console.log('groupInfo', groupInfo);
        groupInfo.totalVisits = groupInfo.totalVisits + 1;
        yield groupInfo.save();
        const groupVisit = new GroupVisit({
            groupRoomId: data.groupRoomId,
            userId: data.user.userId && data.user.userId,
            language: data.user.language && data.user.language,
            geolocation: data.user.geolocation && data.user.geolocation,
            userAgent: data.user.userAgent,
        });
        yield groupVisit.save();
    }));
};
