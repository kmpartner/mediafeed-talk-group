const _ = require('lodash');

export const getUserNameData = async (textData: any, userId: string) => {
  try {
    const userNameData = {
      userId: userId,
      name: textData.fromName,
    }

    return userNameData;
  } catch(err) {
    console.log(err);
  }
}

export const getUserNameDataListByUserIds = async (
  token: string, 
  userIds: any
) => {
  try {
    const uniqList = _.uniq(userIds);

    const userNameList = [];

    for (const userId of uniqList) {
      userNameList.push({
        userId: userId,
        name: '',
        // name: user.name,
      })

      // const user = await User.findOne({ userId: userId });

      // if (user) {
      //   userNameList.push({
      //     userId: user.userId,
      //     name: user.name,
      //   })
      // }
    }

    return userNameList;
    
  } catch(err) {
    console.log(err);
    throw err;
  }
};
