// const React = window.React = require('react');
import React from 'react';
import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next/hooks';

import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import { configurePushSub, deletePushSub, getPushSub } from '../../util/pushNotification';
import { BASE_URL, PUSH_URL } from '../../App'
// const url = 'http://localhost:4000';
// const url = 'https://rgapi-push.spaceeight.net';
// const url = 'https://dokmp5.spaceeight.net';

const PushNotificationControl = props =>  {
  console.log('push-test-props', props);
  console.log('before useeffect');
  const [t] = useTranslation('translation');

  const [notificationState, setNotifictionState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    getPushSub(
      // PUSH_URL,
      BASE_URL,
      localStorage.getItem('token'),
      localStorage.getItem('userId')
    )
    .then(result => {
      console.log(result);

      if (!result.data.disabled) {
        askForNotificationPermission();
      }
      // setNotifictionState(!result.data.disabled);
    })
    .catch(err => {
      console.log(err);
    });

    // askForNotificationPermission();
  },[]);

function askForNotificationPermission() {
  console.log(Notification);
  setIsLoading(true);

  Notification.requestPermission((result) => {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');


    } else {
      console.log('granted');

      // configurePushSub(PUSH_URL,  localStorage.getItem('token'))
      configurePushSub(BASE_URL,  localStorage.getItem('token'))
        .then(result => {
          console.log(result);
          setNotifictionState(!result.data.disabled);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });

    }
  });
}


  const deletePushSubHandler = () => {
    setIsLoading(true);

    // deletePushSub(PUSH_URL,  localStorage.getItem('token'))
    deletePushSub(BASE_URL,  localStorage.getItem('token'))
      .then(result => {
        console.log(result);
        setNotifictionState(!result.data.disabled);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      })
  };

  const pushTestHandler = (url, token, userId) => {
    return new Promise((resolve, reject) => {
        fetch(url + `/message-push/test-push`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId
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
            reject({ message: 'test push failed', error: err });
          });

        })
  }



  const displayConfirmNotification = () => {
    console.log('in displayConfirmNotification navigator', navigator);
    if ('serviceWorker' in navigator) {
      let options = {
        body: 'You successfully sbscribed to our Notification service!',
        icon: '/icon-96x96.png',
        image: '/earthrise.jpg',
        dir: 'ltr',
        lang: 'en-US', // BCP 47
        vibrate: [300, 500, 500],
        badge: '/icon-96x96.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
          { action: 'confirm', title: 'Okay', icon: '/icon-96x96.png' },
          { action: 'cancel', title: 'Cancel', icon: '/icon-96x96.png' }
        ]
      };

      navigator.serviceWorker.ready
        .then((swreg) => {
          swreg.showNotification('Successfully subscribed!', options);
        })
        .catch(err => {
          console.log(err);
        });
    }

    // let options = {
    //   body: 'You successfully sbscribed to our Notification service!',
    //   icon: '/icon-96x96.png',
    //   image: '/earthrise.jpg',
    //   dir: 'ltr',
    //   lang: 'en-US', // BCP 47
    //   vibrate: [200, 200, 400],
    //   badge: '/icon-96x96.png'
    // };

    // new Notification('Successfully subscribed!', options);

  }

  const displayNotification = (contentObj) => {
    console.log('in displayConfirmNotification navigator', navigator);
    if ('serviceWorker' in navigator) {
      let options = {
        body: contentObj.content,
        icon: '/icon-96x96.png',
        image: '/earthrise.jpg',
        dir: 'ltr',
        lang: 'en-US', // BCP 47
        vibrate: [300, 500, 500],
        badge: '/icon-96x96.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
          { action: 'confirm', title: 'Okay', icon: '/icon-96x96.png' },
          { action: 'cancel', title: 'Cancel', icon: '/icon-96x96.png' }
        ]
      };

      navigator.serviceWorker.ready
        .then((swreg) => {
          swreg.showNotification(contentObj.title, options);
        })
        .catch(err => {
          console.log(err);
        });
    }

    // let options = {
    //   body: 'You successfully sbscribed to our Notification service!',
    //   icon: '/icon-96x96.png',
    //   image: '/earthrise.jpg',
    //   dir: 'ltr',
    //   lang: 'en-US', // BCP 47
    //   vibrate: [200, 200, 400],
    //   badge: '/icon-96x96.png'
    // };

    // new Notification('Successfully subscribed!', options);

  }


    return (<span>
      <span>
        {/* Notification: */}
        {t('userInfo.text13')}:
        <Button mode="flat">{notificationState ? "ON" : "OFF"}</Button>
      </span>
      
      {notificationState ? 
          <span>
            <Button mode="raised" 
              disabled={isLoading} 
              onClick={deletePushSubHandler}
              loading={isLoading}
            >
              {/* Disable notification */}
              {t('userInfo.text14', 'Disable notification')}
            </Button>
          </span>
        : 
          <span>
            <Button mode="raised"
              disabled={isLoading}
              onClick={askForNotificationPermission}
              loading={isLoading}
            >
              {/* Enable notification */}
              {t('userInfo.text15', 'Enable notification')}
            </Button>
          </span>
      }

      {/* {isLoading ? <Loader /> : null} */}

      {/* <button onClick={() => {pushTestHandler(PUSH_URL, localStorage.getItem('token'), localStorage.getItem('userId'))}}>test-push</button> */}
    </span>)
  
}
export default PushNotificationControl;

