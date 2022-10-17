const GroupTalk = require('./models/group-talk');
const { authUserId } = require('./util/auth');

//// interface import
import { groupElement } from './server';



exports.handleDeleteGroupMember = (socket: any) => {
  socket.on('delete-group-member', async (data: any) => {
    console.log('delete-group-member, data', data);
    
    try {
      const jwtUserId = await authUserId(data.token);
  
      if (!jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }
  
      const groupTalk = await GroupTalk.findOne({
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
      const withoutUserAllMemberIds = groupTalk.allMemberUserIds.filter((element: any) => {
        return element.userId !== data.deleteUserId;
      });
  
      // console.log('withoutUserAllMemberIds', withoutUserAllMemberIds)
  
      groupTalk.allMemberUserIds = withoutUserAllMemberIds;
      await groupTalk.save();
  
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
        // groupRoomId: data.groupRoomId
      });
  
      // socket.to(data.groupRoomId).emit('update-group', {
      //   group: groupObj,
      // });
  
  
    } catch(err: any) {
      console.log(err);
  
      socket.emit('delete-group-member-result', {
        // action: 'delete-group-member',
        message: err.message,
        error: { message: err.message, name: err.name }
      });
    }
  
  });
}

