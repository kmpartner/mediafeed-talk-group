const UserRecentVisit = require('../../models/user/user-recent-visit');


const addRecentVisitGroupId = async (req, res, next) => {
  try {
    const { groupId, creatorId } = req.body;
    const userId = req.userId;

    if (creatorId == userId) {
      const error = new Error('ids should be different');
      error.statusCode = 400;
      throw error;
    }

    const userRecentVisit = await UserRecentVisit.findOne({ userId: userId });

    const addData = { 
      groupId: groupId,
      creatorId: creatorId,
      time: Date.now(),
    };

    if (!userRecentVisit) {
      const newRecentVisit = new UserRecentVisit({
        userId: userId,
        recentVisitPostIds: [],
        recentVisitGroupIds: [addData],
        recentVisitTalkUserIds: [],
      });

      await newRecentVisit.save();

    } else {
      const groupVisits = userRecentVisit.recentVisitGroupIds;
      let addedList = groupVisits.concat(addData);

      if (addedList.length > 1000) {
        addedList = addedList.slice(-1000);
      }

      userRecentVisit.recentVisitGroupIds = addedList;
      await userRecentVisit.save();
    }
  
    res.status(200).json({ message: 'add recent visit groupId success' });
    
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};


const addRecentVisitTalkUserId = async (req, res, next) => {
  try {
    const { destUserId } = req.body;
    const userId = req.userId;

    if (destUserId === userId) {
      const error = new Error('ids should be different');
      error.statusCode = 400;
      throw error;
    }

    const userRecentVisit = await UserRecentVisit.findOne({ userId: userId });

    const addData = { 
      userId: destUserId,
      time: Date.now(),
    };

    if (!userRecentVisit) {
      const newRecentVisit = new UserRecentVisit({
        userId: userId,
        recentVisitPostIds: [],
        recentVisitGroupIds: [],
        recentVisitTalkUserIds: [addData],
      });

      await newRecentVisit.save();
      
    } else {
      const talkVisits = userRecentVisit.recentVisitTalkUserIds;
      let addedList = talkVisits.concat(addData);

      if (addedList.length > 1000) {
        addedList = addedList.slice(-1000);
      }

      userRecentVisit.recentVisitTalkUserIds = addedList;
      await userRecentVisit.save();
    }

    res.status(200).json({ message: 'add recent visit talk userId success' });
  
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};

module.exports = {
  addRecentVisitGroupId,
  addRecentVisitTalkUserId,
}