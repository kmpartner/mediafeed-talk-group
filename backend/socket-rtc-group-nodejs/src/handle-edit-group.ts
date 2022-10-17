const GroupTalk = require('./models/group-talk');
const { authUserId } = require('./util/auth');

import { Error } from 'mongoose';

//// interface import
import { groupElement } from './server';

const GroupVisit = require('./models/group-visit');


exports.handleEditGroup = (socket: any) => {

  socket.on('create-group', async (data: any) => {
    console.log('create-group data', data);

    try {
      const jwtUserId = await authUserId(data.token);

      if (!jwtUserId || data.userId !== jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }

      //// name validation
      if (
        !data.groupName || 
        data.groupName.length < 5 || 
        data.groupName.length > 100
      ) {
        const error = new Error('group name should be 5-100 characters length');
        error.name = 'groupNameInputError';
        throw error;
      }

      //// keywords validation
      if (data.keywords && data.keywords.length > 5) {
        const error = new Error('Too many number of keywords exist, maximum number is 5');
        error.name = 'keywordNumberError';
        throw error;
      }

      if (data.keywords && data.keywords.length > 0) {
        const longKeyword = data.keywords.find((keyword: string) => {
          return keyword.length > 20;
        });

        if (longKeyword) {
          const error = new Error('Too long keyword exist, maximum 20 characters');
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
    
      newGroup = await GroupTalk.findOne({
        creatorUserId: data.userId,
        groupName: data.groupName
      });

      if (newGroup) {
        throw new Error('Error, group already exist');
      }

      if (!newGroup) {
        newGroup = await new GroupTalk({
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
        await newGroup.save();

        socket.emit('create-group-result', {
          group: newGroup,
          message: 'group created'
        });
      } 
      else {
        throw new Error('group creation failed. group already exist');
      }

    } catch(err: any) {
      console.log(err);

      socket.emit('create-group-result', {
        // group: '',
        message: err.message,
        error: { message: err.message, name: err.name }
      });
    }

  });



  socket.on('upgrade-group', async (data: any) => {
    console.log('upgrade-group data', data);

    try {
      const jwtUserId = await authUserId(data.token);

      if (!jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }

      //// name description validation
      if (
        !data.newGroupName || 
        data.newGroupName.length < 5 || 
        data.newGroupName.length > 100
      ) {
        const error = new Error('group name should be 5-100 characters length');
        error.name = 'groupNameInputError';
        throw error;
      }

      if (data.newDescription && data.newDescription.length > 500) {
        const error = new Error('description should be less than 500 characters length');
        error.name = 'groupDescriptionInputError';
        throw error;
      }

      //// keywords validation
      if (data.newKeywords && data.newKeywords.length > 5) {
        const error = new Error('Too many number of keywords exist, maximum number is 5');
        error.name = 'keywordNumberError';
        throw error;
      }

      if (data.newKeywords && data.newKeywords.length > 0) {
        const longKeyword = data.newKeywords.find((keyword: string) => {
          return keyword.length > 20;
        });

        if (longKeyword) {
          const error = new Error('Too long keyword exist, maximum 20 characters');
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

      const group = await GroupTalk.findOne({
        creatorUserId: data.userId,
        groupName: data.previousGroupName,
        _id: data.groupRoomId, 
      });

      if (!group) {
        throw new Error('group does not exist');
      }
      if (group.creatorUserId !== jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }
      else {
        group.groupName = data.newGroupName;
        group.description = data.newDescription;
        group.keywords = data.newKeywords;
        group.tags = tagList;
        await group.save();

        socket.emit('upgrade-group-result', {
          // group: '',
          message: 'group updated',
        });
      }

    } catch(err: any) {
      console.log(err);

      socket.emit('upgrade-group-result', {
        // group: '',
        message: err.message,
        error: { message: err.message, name: err.name }
      });
    }

  });


}



exports.handleDeleteGroup = (socket: any) => {
  socket.on('delete-group', async (data: any) => {
    console.log('delete-group, data', data);
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

      if (
        groupTalk.creatorUserId !== data.user.userId ||
        groupTalk.creatorUserId !== jwtUserId
      ) {
        throw new Error('deletion failed, only creator can delete group');
      }

      await GroupTalk.deleteOne({ _id: data.groupRoomId });



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
        // groupRoomId: data.groupRoomId
      });


    } catch(err: any) {
      console.log(err);

      socket.emit('delete-group-result', {
        // action: 'delete-group-member',
        message: 'delete group failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
}


exports.handleGetGroup = (socket: any) => {
  socket.on('get-group-info', async (data: any) => {
    console.log('get-group-info data', data);


    const groupInfo = await GroupTalk.findById(data.groupRoomId);

    // console.log('groupInfo', groupInfo);

    // const groupInActiveGroups = this.activeGroups.find(element => {
    //   return element.groupRoomId === data.groupRoomId;
    // });

    const groupObj: groupElement = {
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
        // members: group.members,
    }

    socket.emit('update-group', {
      group: groupObj,
    });

    // console.log('groupInfo', groupInfo);
    groupInfo.totalVisits = groupInfo.totalVisits + 1;
    await groupInfo.save();

    const groupVisit = new GroupVisit({
      groupRoomId: data.groupRoomId,
      userId: data.user.userId && data.user.userId,
      language: data.user.language && data.user.language,
      geolocation: data.user.geolocation && data.user.geolocation,
      userAgent: data.user.userAgent,
    });
    await groupVisit.save();
  });
  
}
