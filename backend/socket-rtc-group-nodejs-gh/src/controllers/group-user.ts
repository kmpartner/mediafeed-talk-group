export {}
const GroupTalk = require('../models/group-talk');
const GroupUser = require('../models/group-user');

import { getUserNameDataListByUserIds } from '../util/get-user-name-data-util';

const getUserFavoriteGroups = async(req: any, res: any, next: any) => {
  try {
    const groupUser = await GroupUser.findOne({ userId: req.userId });

    if (!groupUser) {
      const error = new Error('user not found');
      // error.statusCode = 403;
      throw error;
      // return;
    }
    
    const returnList = [];

    for (const group of groupUser.favoriteGroups) {
      const groupRoomId = group.groupRoomId;

      const groupInfo = await GroupTalk.findOne({ _id: groupRoomId });

      if (groupInfo) {
        returnList.push(groupInfo);
      }
    }

    res.status(200).json({ 
      message: 'get user favorite groups success',
      data: returnList,
    });
  
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUsersForGroup = async (req: any, res: any, next: any) => {
  try { 
    // console.log('req.query', req.query)
    const groupInfo = await GroupTalk.findOne({ _id: req.query.groupRoomId });
    
    if (!groupInfo) {
      const error = new Error('group not found');
      // error.statusCode = 400;
      throw error;
    }

    const allMemberUserIds = groupInfo.allMemberUserIds;

    const isMember = allMemberUserIds.find((member: any) => {
      return member.userId === req.userId;
    });

    if (!isMember) {
      const error = new Error('not member of group');
      // error.statusCode = 400;
      throw error;
    }


    const otherIdList = [];

    for (const member of allMemberUserIds) {
      if (member.userId !== req.userId) {
        otherIdList.push(member.userId);
      }
    }

    let userNameDataList = [];
    let token;
    const authHeader = req.get('Authorization');
    
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }

    userNameDataList = await getUserNameDataListByUserIds(token, otherIdList);

    return res.status(200).json({
      message: 'get users name data for group success',
      data: userNameDataList,
      // groupInfo: groupInfo,
      userNameDataList: userNameDataList,
    });

  } catch(err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getUserFavoriteGroups,
  getUsersForGroup,
}