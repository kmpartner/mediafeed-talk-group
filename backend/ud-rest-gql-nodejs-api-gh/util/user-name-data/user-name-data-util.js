const _ = require('lodash');

const User = require('../../models/user/user');

const getUserNameData = async (token, userId, user) => {
  try {
    return {
      userId: userId,
      name: user?.name || '',
    };
    
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const getUserNameDataList = async (token, users) => {
  try {

    const userNameList = [];

    for (const user of users) {
      userNameList.push({
        userId: user.userId,
        name: user.name,
      })
    }

    return userNameList;
    
  } catch(err) {
    console.log(err);
    throw err;
  }
};


const getUserNameDataListByUserIds = async (token, userIds) => {
  try {
    const uniqList = _.uniq(userIds);

    const userNameList = [];

    for (const userId of uniqList) {
      const user = await User.findOne({ userId: userId });

      if (user) {
        userNameList.push({
          userId: user.userId,
          name: user.name,
        })
      }
    }

    return userNameList;
    
  } catch(err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getUserNameData,
  getUserNameDataList,
  getUserNameDataListByUserIds,
}