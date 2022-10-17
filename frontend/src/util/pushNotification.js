
export const configurePushSub = (url, token) => {
  return new Promise((resolve, reject) => {

    console.log('in configurePushSub', navigator.serviceWorker);
    if (!('serviceWorker' in navigator)) {
      console.log('no serviceWorker in navigator');
      return;
    }
    let reg;

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     // User is signed in.

        navigator.serviceWorker.ready
          .then((swreg) => {
            console.log('swreg', swreg);
            reg = swreg;
            return swreg.pushManager.getSubscription();
          })
          .then((sub) => {
            console.log('sub', sub);

            // if (sub === null) {

            // create a new subscription

            //// urlBase64ToUint8Array()
            const convert = (base64String) => {
              var padding = '='.repeat((4 - base64String.length % 4) % 4);
              var base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

              var rawData = window.atob(base64);
              var outputArray = new Uint8Array(rawData.length);

              for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
              }
              return outputArray;
            }

            const vapidPublicKey = 'BGzM4tulQKtGe2-ANtU5bIEqS93uP1-lMAL1T37WxbiCEq4Y8OYmtE9bYpo1Ld-l5SnllRXXOxGUQcvAjeY_8wA';
            const convertedVapidPublicKey = convert(vapidPublicKey);
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidPublicKey
            });

            // } else {
            //   // we have a subscription
            //   console.log('aleady have subscription');
            //   reject('user have subscription');
            // }
          })
          .then((newSub) => {
            console.log('newSub', newSub);

            const subData = {
              subscription: newSub,
              userId: localStorage.getItem('userId'),
              updateTime: Date.now(),
              disabled: false
            }
            console.log('subData', subData);


            fetch(url + `/push-subscription/`, {
              method: 'PUT',
              headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(subData)
            })
              .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                  throw new Error("Put push subscriptin failed!");
                }
                return res.json();
              })
              .then(resData => {
                console.log(resData);
          
                resolve({ message: 'Put push subscription success', data: resData.data });
              })
              .catch(err => {
                console.log(err);
                reject({ message: 'Put push subscription failed', error: err });
              });


          })
          .catch((err) => {
            console.log(err);
            reject(`error occured, ${err}`);
          })

    //   } else {
    //     // No user is signed in.
    //     console.log('no fb user');
    //   }
    // });

  })

}

export const getPushSub = (url, token, userId) => {
  return new Promise((resolve, reject) => {
    fetch(url + `/push-subscription?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Put push subscriptin failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        resolve({ message: 'Get push subscription success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Get push subscription failed', error: err });
      });
  })
}

export const deletePushSub = (url, token) => {
  return new Promise((resolve, reject) => {

    fetch(url + `/push-subscription/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: localStorage.getItem('userId')
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Delete push subscriptin failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
  
        resolve({ message: 'Delete push subscription success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        reject({ message: 'Delete push subscription failed', error: err });
      });


      // fetch(url + `/push-subscription/subscriptions?userId=${localStorage.getItem('userId')}`, {
      //   method: 'GET',
      //   headers: {
      //     // Authorization: 'Bearer ' + token,
      //     'Content-Type': 'application/json'
      //   },
      // })
      //   .then(res => {
      //     if (res.status !== 200 && res.status !== 201) {
      //       throw new Error("Get push subscriptin failed!");
      //     }
      //     return res.json();
      //   })
      //   .then(resData => {
      //     console.log(resData);
    
      //     resolve({ message: 'Get push subscription success', data: resData.data });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     reject({ message: 'Get push subscription failed', error: err });
      //   });

  })
}


export const postUpdatePushHandler = (url, token, userId, postData) => {
  return new Promise((resolve, reject) => {
      fetch(url + `/message-push/test-push`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          postData: postData
        })
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("test push failed!");
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
    
          resolve({ message: 'test push success', data: resData.data });
          // displayNotification(resData.data.pushContent);
        })
        .catch(err => {
          console.log(err);
          resolve({ message: 'test push failed', error: err });
        });

      })
}


export const commentPushHandler = (url, token, userId, postCreatorId, commentData) => {
  return new Promise((resolve, reject) => {
      fetch(url + `/comment-push/comment-push`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          postCreatorId: postCreatorId,
          commentData: commentData
        })
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("comment push failed!");
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
    
          resolve({ message: 'comment push success', data: resData.data });
          // displayNotification(resData.data.pushContent);
        })
        .catch(err => {
          console.log(err);
          resolve({ message: 'comment push failed', error: err });
        });

      })
}


export const sendTextPushHandler = (url, token, userId, textData) => {
  return new Promise((resolve, reject) => {
      fetch(url + `/talk-push/push-text-to-user`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          textData: textData
        })
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("test push failed!");
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
    
          resolve({ message: 'test push success', data: resData.data });
          // displayNotification(resData.data.pushContent);
        })
        .catch(err => {
          console.log(err);
          resolve({ message: 'test push failed', error: err });
        });

      })
}

export const sendGroupTextPushHandler = (url, token, userId, sendIds, textData) => {
  return new Promise((resolve, reject) => {
      fetch(url + `/group-push/push-text-to-users`, {
      // fetch(url + `/talk-push/push-text-to-users`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          sendIds: sendIds,
          textData: textData,
        })
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("push failed!");
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
    
          resolve({ message: 'push success', data: resData.data });
          // displayNotification(resData.data.pushContent);
        })
        .catch(err => {
          console.log(err);
          resolve({ message: 'push failed', error: err });
        });

      })
}