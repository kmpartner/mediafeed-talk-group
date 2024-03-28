const _ = require('lodash');

const GroupTalk = require('./models/group-talk');
const GroupUser = require('./models/group-user');
const { authUserId } = require('./util/auth');

//// interface import
// import { groupElement } from './server';


exports.handleGroupUser = (socket: any) => {
  socket.on('get-group-user', async (data: any) => {
    console.log('get-group-user data', data);

    try {
      const jwtUserId = await authUserId(data.token);

      if (!jwtUserId || data.userId !== jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }

      const groupUser = await GroupUser.findOne({
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
    catch(err: any) {
      console.log(err);

      socket.emit('get-group-user-result', {
        // action: 'delete-group-member',
        message: 'get group user failed',
        error: { message: err.message, name: err.name }
      });
    }

  });


  socket.on('edit-favorite-groups', async (data: any) => {
    console.log('edit-favorite-groups data', data);
    
    const newFavoriteGroups = data.favoriteGroups;

    try {
      const jwtUserId = await authUserId(data.token);

      if (!jwtUserId || data.userId !== jwtUserId) {
        const error = new Error('Error, not authenticated');
        error.name = 'authError';
        throw error;
      }

      const groupUser = await GroupUser.findOne({
        userId: data.userId,
      });

      if (!groupUser) {
        const error = new Error('Error, user not found');
        // error.name = 'authError';
        throw error;
      }

      const uniqueList = _.uniqBy(newFavoriteGroups, function(e: any) {
        return e.groupRoomId;
      });

      if (uniqueList.length !== newFavoriteGroups.length) {
        const error = new Error('Error, something wrong, duplicate');
        // error.name = 'authError';
        throw error;
      }
      // console.log('uniqueList', uniqueList);

      groupUser.favoriteGroups = uniqueList;
      await groupUser.save();

      socket.emit('edit-favorite-groups-result', {
        // action: 'delete-group-member',
        message: 'Editing favorite groups success',
        groupUserInfo: groupUser
      });

    }
    catch(err: any) {
      console.log(err);

      socket.emit('edit-favorite-groups-result', {
        // action: 'delete-group-member',
        message: 'Editing favorite groups failed',
        error: { message: err.message, name: err.name }
      });
    }

  });
}

