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
const { pushTextToUsers2 } = require('./util/push-notification');
exports.handlePushNotification = (socket) => {
    socket.on('group-text-send-result-recieved', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('group-text-send-recieved, data', data);
        try {
            const textData = data.textData;
            if (!textData) {
                throw new Error('textData not found');
            }
            const pushResult = yield pushTextToUsers2(textData.fromUserId, data.idsForPush, textData, textData.groupRoomId);
            // console.log('pushResult', pushResult);
            socket.emit('group-push-result', {
                message: 'group push notify success',
                pushResult: pushResult
            });
        }
        catch (err) {
            console.log(err);
            socket.emit('group-push-result', {
                message: 'group push notify failed',
                error: { message: err.message, name: err.name }
            });
        }
    }));
};
