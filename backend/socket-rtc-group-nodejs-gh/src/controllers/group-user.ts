export {}
const GroupTalk = require('../models/group-talk');
const GroupUser = require('../models/group-user');

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
  
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getUserFavoriteGroups,
}