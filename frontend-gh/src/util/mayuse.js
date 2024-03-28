
export const pushTestHandler = (url, token, userId, postData) => {
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

// AutosuggestHook.js

// if (titleNameContain.length > 4) {
//   titleNameContain = titleNameContain.slice(0, 4);
// }


// FeedImage.js

// useEffect(() => {
//   window.onscroll = function(ev) {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//         // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
//         moreImageHandler();
//     }
//   };
// },[]);

// import { createBrowserHistory } from 'history';

// import * as firebase from "firebase/app";

// // Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";

// export const getBrowserHistory = () => {
//   let history = createBrowserHistory();
//   console.log('history', history);
//   const startTime = Date.now();
//   const origin = window.location.origin;

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       // User is signed in.

//       history.listen(({ action, location }) => {
//       //   // console.log(props.fbUser, props.fbUser.user);
//       //   props.d.driverFbUser.handlers.addBrowserHistoryFbUser({
//       //     action: action,
//       //     location: location,
//       //     time: Date.now(),
//       //     startTime: startTime,
//       //     fbUserId: user.uid, 
//       //     origin: origin,
//       //   });

//         console.log(
//           `The current URL is ${location.pathname}${location.search}${location.hash}`
//         );
//         console.log(`The last navigation action was ${action}`);
//       });

//     } else {
//       // No user is signed in.
//       console.log('no fbuser');

//       history.listen(({ action, location }) => {
//         // console.log(props.fbUser, props.fbUser.user);
//         // props.d.driverFbUser.handlers.addBrowserHistory({
//         //   action: action,
//         //   location: location,
//         //   time: Date.now(),
//         //   startTime: startTime,
//         //   fbUserId: '', 
//         //   origin: origin,
//         // });

//         console.log(
//           `The current URL is ${location.pathname}${location.search}${location.hash}`
//         );
//         console.log(`The last navigation action was ${action}`);
//       });

//     }
//   });
// }



