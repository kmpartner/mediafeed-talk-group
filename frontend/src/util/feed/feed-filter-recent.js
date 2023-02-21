export const getRecentMostVisitLngPosts = async (url, token) => {
  try {
    const response = await fetch(url + `/feed-filter-recent/recent-most-visit-lng-posts`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //   groupId: groupId,
      //   creatorId: creatorId,
      // }),
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