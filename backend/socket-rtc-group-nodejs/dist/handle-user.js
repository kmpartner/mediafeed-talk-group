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
const _ = require('lodash');
const GroupTalk = require('./models/group-talk');
const GroupUser = require('./models/group-user');
const { authUserId } = require('./util/auth');
//// interface import
// import { groupElement } from './server';
exports.handleGroupUser = (socket) => {
    socket.on('get-group-user', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('get-group-user data', data);
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId || data.userId !== jwtUserId) {
                const error = new Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            const groupUser = yield GroupUser.findOne({
                userId: data.userId,
            });
            if (!groupUser) {
                const error = new Error('Error, user not found');
                // error.name = 'authError';
                throw error;
            }
            socket.emit('get-group-user-result', {
                // action: 'delete-group-member',
                message: 'get group user success',
                groupUserInfo: groupUser
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('get-group-user-result', {
                // action: 'delete-group-member',
                message: 'get group user failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
    socket.on('edit-favorite-groups', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('edit-favorite-groups data', data);
        const newFavoriteGroups = data.favoriteGroups;
        try {
            const jwtUserId = yield authUserId(data.token);
            if (!jwtUserId || data.userId !== jwtUserId) {
                const error = new Error('Error, not authenticated');
                error.name = 'authError';
                throw error;
            }
            const groupUser = yield GroupUser.findOne({
                userId: data.userId,
            });
            if (!groupUser) {
                const error = new Error('Error, user not found');
                // error.name = 'authError';
                throw error;
            }
            const uniqueList = _.uniqBy(newFavoriteGroups, function (e) {
                return e.groupRoomId;
            });
            if (uniqueList.length !== newFavoriteGroups.length) {
                const error = new Error('Error, something wrong, duplicate');
                // error.name = 'authError';
                throw error;
            }
            // console.log('uniqueList', uniqueList);
            groupUser.favoriteGroups = uniqueList;
            yield groupUser.save();
            socket.emit('edit-favorite-groups-result', {
                // action: 'delete-group-member',
                message: 'Editing favorite groups success',
                groupUserInfo: groupUser
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('edit-favorite-groups-result', {
                // action: 'delete-group-member',
                message: 'Editing favorite groups failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
