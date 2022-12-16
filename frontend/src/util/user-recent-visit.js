export const addRecentVisitGroupId = async (url, token, groupId, creatorId) => {
  try {
    const response = await fetch(url + `/user-recent-visit/add-recent-visit-group-id`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupId: groupId,
        creatorId: creatorId,
      }),
    });

    console.log(response);
    if (response.ok) {
      const resData = await response.json();
      console.log(resData);
      return resData;
      // resolve(resData);
    } else {
      // reject({ message: 'get ads failed' });
      throw new Error('something wrong')
    }
  } 
  catch (err) {
    console.log(err);
    throw err;
  }
};

export const addRecentVisitTalkUserId = async (url, token, destUserId) => {
  try {
    const response = await fetch(url + `/user-recent-visit/add-recent-visit-talk-user-id`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        destUserId: destUserId,
      }),
    });

    console.log(response);
    if (response.ok) {
      const resData = await response.json();
      console.log(resData);
      return resData;
      // resolve(resData);
    } else {
      // reject({ message: 'get ads failed' });
      throw new Error('something wrong')
    }
  } 
  catch (err) {
    console.log(err);
    throw err;
  }
};