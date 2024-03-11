
const getUserNameData = async (token, userId, user) => {
  try {
    return {
      userId: user.userId,
      name: user.name,
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

module.exports = {
  getUserNameData,
  getUserNameDataList,
}