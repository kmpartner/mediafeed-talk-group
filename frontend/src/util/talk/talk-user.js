export const getTalkAcceptedUsers = async (url, token) => {
  try {
    const result = await fetch(url + '/talk-user/talk-accepted-users', {
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