// import { BASE_URL, GQL_URL } from '../App';

export const createPostUserReaction = (url, token, userId, type, postId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/user-reaction/post?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        type: type,
        postId: postId,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Could't create user reaction!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'user reaction create success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'user reaction creation failed', error: err });
      });

  })
}

export const getPostUserReaction = (url, token, userId, type, postId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/user-reaction/post-get?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        type: type,
        postId: postId,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Could't get user reaction!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'user reaction get success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'user reaction get failed', error: err });
      });

  })
}

export const deletePostUserReaction = (url, token, userId, type, postId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/user-reaction/post?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        type: type,
        postId: postId
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("delete reaction failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'user reaction delete success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Delete user reaction failed', error: err });
      });
  })
}



export const createPostCommentUserReaction = (url, token, userId, type, commentId, postId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/user-reaction/comment?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        type: type,
        commentId: commentId,
        postId: postId,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Could't create user comment reaction!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'user comment reaction create success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'user comment reaction creation failed', error: err });
      });

  })
};

export const getPostCommentUserReactions = (url, token, userId, type, postId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/user-reaction/comments-get?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        type: type,
        postId: postId,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Could't get user comment reactions!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'user comment reactions get success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'user comment reactions get failed', error: err });
      });

  })
};

export const deletePostCommentUserReaction = (url, token, userId, type, commentId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/user-reaction/post?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        type: type,
        commentId: commentId,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("delete reaction failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'user reaction delete success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Delete user reaction failed', error: err });
      });
  })
};






// export const createGroupTalkTextUserReaction = (url, token, userId, type, textId) => {
//   return new Promise((resolve, reject) => {

//     fetch(url + `/user-reaction/group-talk?userLocation=${localStorage.getItem('userLocation')}`, {
//       method: 'POST',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         userId: userId,
//         type: type,
//         textId: textId,
//         // geolocation: userLocation,
//       })
//     })
//       .then(res => {
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error("Can't create user reaction!");
//         }
//         return res.json();
//       })
//       .then(resData => {
//         console.log(resData);

//         resolve({ message: 'user reaction create success', data: resData });
//       })
//       .catch(err => {
//         console.log(err);
//         reject({ message: 'user reaction creation failed', error: err });
//       });

//   })
// }


// export const deleteGroupTalkTextUserReaction = (url, token, userId, type, textId) => {
//   return new Promise((resolve, reject) => {

//     fetch(url + `/user-reaction/group-talk?userLocation=${localStorage.getItem('userLocation')}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         userId: userId,
//         type: type,
//         textId: textId
//       })
//     })
//       .then(res => {
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error("delete user reaction failed!");
//         }
//         return res.json();
//       })
//       .then(resData => {
//         console.log(resData);

//         resolve({ message: 'user reaction delete success', data: resData });
//       })
//       .catch(err => {
//         console.log(err);
//         reject({ message: 'Delete user reaction failed', error: err });
//       });
//   })
// };