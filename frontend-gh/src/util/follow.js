export const getFollowedUserList = (url, token, userId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/follow/followed-userlist?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting followed users failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
  
        resolve({ message: 'followed users get success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get followed users failed', error: err });
      });

  })
}

export const getPostFavoriteUserList = (url, postId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/follow/favoritepost-userlist?postId=${postId}`, {
      method: 'GET',
      headers: {
        // Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting Favorite users failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
  
        resolve({ 
          message: 'follow favorite users get success', 
          data: resData.data,
          userNameDataList: resData.userNameDataList,
        });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get favorite users failed', error: err });
      });

  })
}