import { BASE_URL, GQL_URL } from '../App';
// import jwt from 'jsonwebtoken';
import { isExpired, decodeToken } from "react-jwt";
// // import * as firebase from "firebase/app";

// // // Add the Firebase services that you want to use
// // import "firebase/auth";
// // import "firebase/firestore";

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

export const getUserData = (url, token) => {
  return new Promise((resolve, reject) => {

    fetch(url + '/auth/userdata', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting user data failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'Get User Data.', userData: resData.data });

      })
      .catch(err => {
        console.log(err);
        reject('Get user data failed.')
      });

      return Promise;
  })
};

export const getUserDataForStore = (url, token) => {
  return new Promise((resolve, reject) => {

    fetch(url + '/auth/userdata', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting user data failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        resolve({ message: 'Get User Data.', userData: resData.data });

      })
      .catch(err => {
        console.log(err);
        reject('Get user data failed.')
      });

      return Promise;
  })
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(success => {
      console.log(success);
      
      const userLocation = {
        coords: {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
          altitude: success.coords.altitude,
          accuracy: success.coords.accuracy,
          altitudeAccuracy: success.coords.altitudeAccuracy,
          heading: success.coords.heading,
          speed: success.coords.speed,
        },
        timestamp: success.timestamp,
      }

      localStorage.setItem('userLocation', JSON.stringify(userLocation));
      // console.log(JSON.parse(localStorage.getItem('userLocation')));
      
      resolve({ message: 'get user location data success', data: success });
      
    }, error => {
      console.log(error);

      localStorage.setItem('userLocation', null);
      // console.log(JSON.parse(localStorage.getItem('userLocation')));

      resolve({ message: 'get user location data failed', data: null });
    });
  })
}


export const updateUserLocation = (status, location, url, token) => {
  return new Promise((resolve, reject) => {
    
    // let userLocation = {};
    let userLocation;
    if (location) {
      userLocation = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          accuracy: location.coords.accuracy,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          speed: location.coords.speed,
        },
        timestamp: location.timestamp,
      }
    }

    fetch(url + '/auth/status', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: status,
        geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update location status!");
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        resolve({ message: 'update location success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'update location failed', error: err });
      });

  })
}

export const updateUserName = (name, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/auth/name?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update name!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'user name update success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'user name update failed', error: err });
      });

  })
}

export const updateUserDescription = (description, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/auth/description?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description,
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update description!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'user description update success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'user description update failed', error: err });
      });

  })
}

export const getUserDescription = (url, token, userId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/description?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting user description failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        resolve({ message: 'Get User Description Success.', data: resData.data });

      })
      .catch(err => {
        console.log(err);
        reject('Get user description failed.')
      });

      return Promise;
  })
};

export const updateEmailVerified = (emailVerified, fbUserId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/auth/email-verified?userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailVerified: emailVerified,
        fbUserId: fbUserId
        // geolocation: userLocation,
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update emailVerified fbUserId!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'emailVerified fbUserId update success', data: resData });
      })
      .catch(err => {
        console.log(err);
        resolve({ message: 'emailVerified fbUserId update failed', error: err });
        // reject({ message: 'emailVerified fbUserId update failed', error: err });
      });

  })
}

export const getUsers = (url, token) => {
  return new Promise((resolve, reject) => {

    fetch(url + '/auth/getusers', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting users data failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        resolve({ message: 'Get Users Data.', usersData: resData.data });

      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get users data failed.',  error: err })
      });

      return Promise;
  })
};

export const getUsersForGroup = (url, token, groupRoomId, groupMemberIds) => {
  return new Promise((resolve, reject) => {

    // let fullUrl = url + '/auth/getusers-for-group';
    let fullUrl = url + `/group-user/users-for-group?groupRoomId=${groupRoomId}`;

    // if (groupMemberIds) {
    //   fullUrl = url + `/auth/getusers-for-group?groupMemberIds=${JSON.stringify(groupMemberIds)}`;
    // }

    fetch(fullUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting users data for group failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        resolve({ 
          message: 'Get Users Data for group success.', 
          data: resData.data,
          groupInfo: resData.groupInfo,
          userNameDataList: resData.userNameDataList,
        });

      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get users data for group failed.',  error: err })
      });

      return Promise;
  })
};

export const getUserImageUrl = (url, token, userId) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/user-imageurl?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Getting user imageUrl failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        // resolve({ message: 'Get User imageUrl Data.', userData: resData.data });
        resolve(resData.data)
      })
      .catch(err => {
        console.log(err);
        reject('Get user imageUrl data failed.')
      });

      // return Promise;
  })
};


export const getFollowingUsers = (userId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/followusers`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },

    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting followingUsers failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ 
          message: 'followingUsers get success', 
          data: resData.data,
          userNameDataList: resData.userNameDataList,
         });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get followingUsers data failed', error: err });
      });
  })
};

export const getFollowingUser = (userId, followingUserId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/followuser?userId=${userId}&followingUserId=${followingUserId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },

    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting followingUser failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'followingUser get success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get followingUser data failed', error: err });
      });
  })
};

export const addFollowingUserId = (userId, followingUserId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/followuser`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        followingUserId: followingUserId
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("update followingUsers failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'followingUsers update success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Update followingUsers failed', error: err });
      });
  })
};

export const deleteFollowingUserId = (userId, followingUserId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/followuser`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        followingUserId: followingUserId
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("followingUsers deletion failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'followingUsers delete success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Delete followingUser failed', error: err });
      });
  })
}


export const getFavoritePosts = (userId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/favoriteposts?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },

    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting favoritePosts failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        const lsData = {
          userId: localStorage.getItem('userId'),
          posts: resData.data,
          getDate: Date.now(),
        };

        localStorage.setItem('userFavoritePosts', JSON.stringify(lsData));

        resolve({ message: 'favoritePosts get success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get favoritePosts data failed', error: err });
      });
  })
};

export const getFavoritePost = (postId, userId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/favoritepost?userId=${userId}&postId=${postId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },

    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting favoritePost failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'favoritePost get success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get favoritePost data failed', error: err });
      });
  })
};

export const addFavoritePost = (postId, userId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/favoritepost`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("update favoritePosts failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'favoritePosts update success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Update favoritePosts failed', error: err });
      });
  })
};

export const deleteFavoritePost = (postId, userId, url, token) => {
  return new Promise((resolve, reject) => {
    
    fetch(url + `/follow/favoritepost`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("delete favoritePost failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        resolve({ message: 'favoritePost delete success', data: resData });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Delete favoritePost failed', error: err });
      });
  })
};

export const getTokenForPasswordReset = (url, email) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/reset`, {
      method: 'POST',
      headers: {
        // Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
        })
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting token for password reset failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
  
        resolve({ message: 'token for password reset get success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ 
          message: 'Sending email for password reset failed, Please check email address', error: err 
        });
      });

  })
};

export const getNewPasswordTokenUser = (url, email) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/passwordreset?email=${email}`, {
      method: 'GET',
      headers: {
        // Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting user with reset token failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
  
        resolve({ message: 'user with reset token get success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get user with reset token failed', error: err });
      });

  })
}

// export const resetPassword = (url, email, password, passwordToken, code) => {
//   // console.log('in resetpasswordhandler');
//   return new Promise((resolve, reject) => {

//     fetch(url + `/auth/passwordreset`, {
//       method: 'POST',
//       headers: {
//         // Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         email: email,
//         password: password,
//         passwordToken: passwordToken
//         })
//       })
//       .then(res => {
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error("Updating password failed!");
//         }
//         return res.json();
//       })
//       .then(resData => {
//         console.log(resData);

//             return firebase.auth().confirmPasswordReset(code, password)
//               .then(result => {
//                 // Update successful.
//                 console.log('password update success');
//                 resolve({ message: 'password update success', data: resData });
//               })
//               .catch(err => {
//                 // An error happened.
//                 console.log(err);
//                 reject({ message: 'Update password failed', error: err });
//               });
        

//       })
//       .catch(err => {
//         console.log(err);
//         reject({ message: 'Update password failed', error: err });
//       });

//   })
// };

export const updateUserInfo = (url, token, userId, email, name, firebaseUserData, fierbaseAdditionalUserInfo) => {
  // console.log('in resetpasswordhandler');
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/updateuserinfo`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        email: email,
        name: name,
        firebaseUserData: firebaseUserData,
        fierbaseAdditionalUserInfo: fierbaseAdditionalUserInfo,
        geolocation: localStorage.getItem('userLocation')
        })
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Updating user info failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'Update user info success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        // reject({ message: 'Update user info failed', error: err });
      });

  })
};

export const getAuthInfo = () => {
  return new Promise((resolve, reject) => {
    const currentUrl = new URL(window.location.href);
    const queryParams = currentUrl.searchParams;
    // console.log(currentUrl);
  
    if (queryParams.get('tokenForCasTGT') || queryParams.get('casTGT')) {
  
      const token = queryParams.get('tokenForCasTGT');
  
      localStorage.setItem('tokenForCasTGT', token);
      localStorage.setItem('casTGT', queryParams.get('casTGT'));
      localStorage.setItem('TGTexp', queryParams.get('TGTexp'));
      // localStorage.setItem('casUserId', queryParams.get('casUserId'));
  
      // const jwtdecoded = jwt.decode(token);
      const jwtdecoded = decodeToken(token);
      console.log(jwtdecoded);
  
      const userId = jwtdecoded.userId;
      const email = jwtdecoded.email;
      const name = jwtdecoded.name;
      const firebaseUserData = jwtdecoded.firebaseUserData;
      const fierbaseAdditionalUserInfo = jwtdecoded.fierbaseAdditionalUserInfo;
      // const firebaseProviderId = jwtdecoded.firebaseProviderId;

      updateUserInfo(
        BASE_URL, 
        token,
        userId, 
        email,
        name,
        firebaseUserData,
        fierbaseAdditionalUserInfo
      )
      .then(result => {
        console.log(result);
  
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        const tokenExpire = new Date(Number(localStorage.getItem('TGTexp')) * 1000);
        localStorage.setItem('expiryDate', tokenExpire);
        
        localStorage.setItem('name', result.data.user.name);
  
        localStorage.removeItem('casTGT');
        localStorage.removeItem('tokenForCasTGT');
        localStorage.removeItem('TGTexp');
        
        resolve({ message: 'login success' });
      })
      .catch(err => {
        console.log(err);
  
        localStorage.removeItem('casTGT');
        localStorage.removeItem('tokenForCasTGT');
        localStorage.removeItem('TGTexp');
  
        reject({ message: 'login failed' });
      })

    } else {
      resolve({ message: 'no TGTtoken' });
    }
  })

}



export const updateUserColor = (url, token, userId, userColor) => {
  // console.log('in resetpasswordhandler');
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/update-user-color`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        userColor: userColor,
        geolocation: localStorage.getItem('userLocation')
        })
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Updating user color failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'Update user color success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Update user color failed', error: err });
      });

  })
};

export const postGetUserImageUrl = (url, token, userId) => {
  // console.log('in resetpasswordhandler');
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/user-imageurl`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        })
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting user imageUrl failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'Get user imageUrl result', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        // reject({ message: 'Get user imageUrl color failed', error: err });
      });

  })
};

export const postGetUserImageUrls = (url, token, userIds) => {
  // console.log('in resetpasswordhandler');
  return new Promise((resolve, reject) => {

    fetch(url + `/auth/user-imageurls`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userIds: userIds,
        })
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Getting user imageUrl failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'Get user imageUrl result', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        // reject({ message: 'Get user imageUrl color failed', error: err });
      });

  })
};


// export const validateAuth = (url, token, userId) => {
//   return new Promise((resolve, reject) => {
//     fetch(url + "/auth/validate-auth", {
//       method: "POST",
//       headers: {
//         Authorization: 'Bearer ' + token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: userId
//       }),
//     })
//       .then((res) => {
//         console.log(res);
//         // return res.json();

//         if (res.ok) {
//           return res.json();
//         }

//         //// error handling
//         return res.json().then((err) => {
//           console.log(err);
//           // throw new Error(data.message || 'Something went wrong')
          
//           if (err.data && err.data.errorType) {
//             reject({
//               message: err.message || "Something went wrong",
//               errorType: err.data.errorType,
//               // error: err
//             });
//           }
          
//           reject({
//             message: err.message || "Something went wrong",
//             // type: "get-api-failed",
//             // error: err
//           });
//         });
//       })
//       .then((resData) => {
//         resolve(resData);
//       })
//       .catch((err) => {
//         console.log(err);
//         reject(err);
//       });
//   });
// };