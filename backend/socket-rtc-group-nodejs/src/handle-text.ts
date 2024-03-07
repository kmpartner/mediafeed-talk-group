const GroupTalk = require('./models/group-talk');
const GroupTalkReaction = require('./models/group-talk-reaction');
const { authUserId } = require('./util/auth');
const { createReturnPost } = require('./util/file-upload-utils');
const { addPageNotificationData } = require('./util/page-notification');

import { Error } from 'mongoose';
//// interface import
import { groupElement, GroupTextInfo } from './server';


exports.handleGroupTextSend = (socket: any) => {
  socket.on('group-text-send', async (data: any) => {
    console.log('group-text-send, data', data);

    try {
      const jwtUserId = await authUserId(data.token);

      if (!jwtUserId || data.fromUserId !== jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }

      const groupTalk = await GroupTalk.findOne({
        _id: data.groupRoomId
      });

      if (!groupTalk) {
        const error = new Error('group talk data not found');
        // error.name = 'authError';
        throw error;
      }
      // console.log('groupTalk', groupTalk);

      const textData: GroupTextInfo = {
        from: data.from,
        fromUserId: data.fromUserId,
        text: data.text,
        fromName: data.fromName,
        groupRoomId: data.groupRoomId,
        sendAt: data.sendAt,
        language: data.language,
        geolocation: data.geolocation,
        fileUrls : data.fileUrls,
        filePaths: data.filePaths,
        fileSizes: data.fileSizes,
      };


      groupTalk.talks.push(textData);
      await groupTalk.save();


      // const group = this.activeGroups.find((element: any) => {
      //   return element.groupRoomId = data.groupRoomId;
      // });


      const groupObj: groupElement = {
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
        // members: group.members,
      };


      const fileUrlsTalks = groupTalk.talks.map((talk: GroupTextInfo) => {
        return createReturnPost(talk);
      });

      const fileUrlsGroupObj = {
        ...groupObj,
        talks: fileUrlsTalks,
      }

      socket.emit('update-group', {
        // group: groupObj,
        group: fileUrlsGroupObj,
      });

      socket.to(data.groupRoomId).emit('update-group', {
        // group: groupObj,
        group: fileUrlsGroupObj,
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

      // console.log('last talks', groupTalk.talks[groupTalk.talks.length -1]);

      socket.emit('group-text-send-result', {
        message: 'group text send success',
        idsForPush: idsForPush,
        // textData: textData,
        textData: createReturnPost(groupTalk.talks[groupTalk.talks.length -1]),
      });


      addPageNotificationData(
        {
          ...data,
          groupName: groupTalk.groupName,
          textId: groupTalk.talks[groupTalk.talks.length - 1]._id.toString(),
        }, 
        idsForPush
      );

    } 
    catch(err: any) {
      console.log(err);

      socket.emit('group-text-send-result', {
        message: 'group text send failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
};



exports.handleGroupTextDelete = (socket: any) => {
  socket.on('group-text-delete', async (data: any) => {
    console.log('group-text-delete, data', data);

    try {
      const jwtUserId = await authUserId(data.token);

      if (!jwtUserId || data.user.userId !== jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }

      const groupTalk = await GroupTalk.findOne({
        _id: data.groupRoomId
      });

      if (!groupTalk) {
        const error = new Error('group talk data not found');
        // error.name = 'authError';
        throw error;
      }

      const talkData = await GroupTalk
        .findOne({ _id: data.groupRoomId })
        .select({ talks: { $elemMatch: { _id: data.groupTalkTextId } }});
      
      if (!talkData || !talkData.talks || talkData.talks.length === 0) {
        const error = new Error('talk data not found');
        // error.name = 'authError';
        throw error;
      }

      const talkDataFromUserId = talkData.talks[0].fromUserId;
      // console.log(talkData);
      // console.log('fromUserId in talkData', talkDataFromUserId);


      if (talkDataFromUserId !== data.user.userId) {
        const error = new Error('request user is diffrent from text created user');
        // error.name = 'authError';
        throw error;
      }


      groupTalk.talks.pull({ _id: data.groupTalkTextId });
      await groupTalk.save();


      const groupObj: groupElement = {
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
        // members: group.members,
      };

      
      const fileUrlsTalks = groupTalk.talks.map((talk: GroupTextInfo) => {
        return createReturnPost(talk);
      });

      const fileUrlsGroupObj = {
        ...groupObj,
        talks: fileUrlsTalks,
      }

      socket.emit('update-group', {
        // group: groupObj,
        group: fileUrlsGroupObj,
      });

      socket.to(data.groupRoomId).emit('update-group', {
        // group: groupObj,
        group: fileUrlsGroupObj
      });




      socket.emit('group-text-delete-result', {
        message: 'group text delete success',
        // idsForPush: idsForPush,
        // textData: textData
      });

    } 
    catch(err: any) {
      console.log(err);

      socket.emit('group-text-delete-result', {
        message: 'group text delete failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
};






exports.handleCreateGroupTextReaction = (socket: any) => {
  socket.on('create-group-text-reaction', async (data: any) => {
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
      const reactionData = new GroupTalkReaction(
        {
          userId: data.userId,
          groupRoomId: data.groupRoomId,
          groupTalkTextId: data.groupTalkTextId,
          type: data.type,
        }
      );
      await reactionData.save();

      socket.emit('create-group-text-reaction-result', {
        message: 'create group text reaction success',
        reactionData: reactionData,
      });

    } 
    catch(err: any) {
      console.log(err);

      socket.emit('create-group-text-reaction-result', {
        message: 'create group text reaction failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
};


exports.handleGetGroupTextReactions = (socket: any) => {
  socket.on('get-group-text-reactions', async (data: any) => {
    console.log('get-group-text-reactions, data', data);

    try {
      // const jwtUserId = await authUserId(data.token);

      // if (!jwtUserId || data.userId !== jwtUserId) {
      //   const error = new Error('Error, not authenticated');
      //   error.name = 'authError';
      //   throw error;
      // }

      const groupRoomReactions = await GroupTalkReaction.find({
        groupRoomId: data.groupRoomId,
      });

      socket.emit('get-group-text-reactions-result', {
        message: 'get group text reactions success',
        // idsForPush: idsForPush,
        groupRoomReactions: groupRoomReactions,
      });

    } 
    catch(err: any) {
      console.log(err);

      socket.emit('get-group-text-reactions-result', {
        message: 'get group text reactions failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
};