export const getUserFavoriteGroups = async (url, token) => {
  try {
    const result = await fetch(url + '/group-user/user-favorite-groups', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });

    const resData = await result.json();

    console.log(result, resData);
    // dispatch('SET_TALKPERMISSION', resData.data);

    if (!result.ok) {
      throw new Error('error occured');
    }

    return resData;
  } catch(err) {
    console.log(err);
    throw err;
  }
};


export const getGroupImages = (url, token, groupRoomIds) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/group-image/group-images?groupRoomIds=${JSON.stringify(groupRoomIds)}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting group images failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        resolve({ message: 'Get group images.', data: resData.data });

      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get group images failed.',  error: err })
      });

      // return Promise;
  })
};


export const getGroupCreatorNameData = async (url, token, creatorUserId) => {
  try {
    const result = await fetch(url + `/group-user/group-creator-name-data?creatorUserId=${creatorUserId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });

    const resData = await result.json();

    console.log(result, resData);
    // dispatch('SET_TALKPERMISSION', resData.data);

    if (!result.ok) {
      throw new Error('error occured');
    }

    return resData;
  } catch(err) {
    console.log(err);
    throw err;
  }
};