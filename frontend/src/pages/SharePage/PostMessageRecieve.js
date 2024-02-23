import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import { useStore } from "../../hook-store/store";
import { getUserDataForStore } from "../../util/user";

import { authPageLink, authSignupPageLink, BASE_URL, SHAREURLS } from "../../App";

import { marks } from "../../images/marks";
import LoginIcon from '../../images/icons/loginIcon-white-48.png';
import SignupIcon from '../../images/icons/signupIcon-white-48.png';


const PostMessageRecieve = (props) => {
  // console.log('PostMessageRecieve-props', props);
  const [t] = useTranslation("translation");

  const { isAuth } = props;

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;

  const [messageData, setMessageData] = useState();


  // useEffect(() => {
  //   return () => {
  //     window.removeEventListener('message', messageListener);
  //     dispatch('SET_SHAREFILE', null);
  //   }
  // },[]);

  useEffect(() => {
    if (isAuth) {
      // const openUrl = 'http://localhost:8503' + "/image-editor";
      const sendData = {
        token: '12345',
        message: 'window opened',
        shareWindowOpen: true,
        isAuth: true,
      };
  
      if (SHAREURLS[0] === 'http://localhost:8503') {
        window.opener.postMessage(sendData, 'http://localhost:8503');
        window.opener.postMessage(sendData, 'http://localhost:8503/image-editor');
        window.opener.postMessage(sendData, 'http://localhost:8503/image-cleaner');
        window.opener.postMessage(sendData, 'http://localhost:8503/image-combiner');
        window.opener.postMessage(sendData, 'http://localhost:8503/image-fusion');      
        window.opener.postMessage(sendData, 'http://localhost:8504/image-xyz');
        window.opener.postMessage(sendData, 'http://localhost:8505');
      }

      if (SHAREURLS[0] === 'https://do-bucket-image-photo-app-test.web.app') {
        window.opener.postMessage(sendData, 'https://do-bucket-image-photo-app-test.web.app');
        window.opener.postMessage(sendData, 'https://do-bucket-image-photo-app-test.web.app/image-editor');
        window.opener.postMessage(sendData, 'https://do-bucket-image-photo-app-test.web.app/image-cleaner');
        window.opener.postMessage(sendData, 'https://do-bucket-image-photo-app-test.web.app/image-combiner');
        window.opener.postMessage(sendData, 'https://do-bucket-image-photo-app-test.web.app/image-fusion');
        window.opener.postMessage(sendData, 'https://draw-dreamer-test.spaceeight.net');
      }

      if (SHAREURLS[0] === 'https://kura-image-photo.spaceeight.net') {
        window.opener.postMessage(sendData, 'https://kura-image-photo.spaceeight.net');
        window.opener.postMessage(sendData, 'https://kura-image-photo.spaceeight.net/image-editor');
        window.opener.postMessage(sendData, 'https://kura-image-photo.spaceeight.net/image-cleaner');
        window.opener.postMessage(sendData, 'https://kura-image-photo.spaceeight.net/image-combiner');
        window.opener.postMessage(sendData, 'https://kura-image-photo.spaceeight.net/image-fusion');
        window.opener.postMessage(sendData, 'https://kura-draw-dreamer.spaceeight.net');
      }

      
      // console.log('message-sent');
    }
  },[isAuth]);

  useEffect(() => {

    if (isAuth) {
      // const messageSourceUrls = SHAREURLS;
        window.addEventListener("message", messageProcessHandler);
      
    }

    return () => {
      window.removeEventListener('message', messageProcessHandler);
      // dispatch('SET_SHAREFILE', null);
    }
  }, [isAuth]);



  function messageProcessHandler(event) {
    const token = '12345';

    console.log("message-event", event.data.token, event.data);
    const isOriginExist = SHAREURLS.find(
      (url) => url === event.origin
    );

    if (!isOriginExist) {
      return;
    }
    // if (event.origin !== messageSourceUrl) {
    //   // The message is not from a trusted origin. Do not process it.
    //   return;
    // }

    // if (event.source !== window.parent) {
    //   // The message is not from a trusted window object. Do not process it.
    //   return;
    // }

    if (event.data.token !== token) {
      // The token is not valid. Do not process the message.
      return;
    }

    console.log("message-event", event);
    if (event.data.shareFile) {
      setMessageData(event.data);
      dispatch('SET_SHAREFILE', event.data.shareFile);
      window.removeEventListener('message', messageProcessHandler);
    }


  }


  
  let postMessageRecieveBody;

  if (!isAuth) {
    postMessageRecieveBody = (
      <div>
        <div>
          Login is required to share file or Signup
        </div>
        <div>
        <div className="">
          <a className="notPageFound__linkButton" href={authPageLink} >
            <Button
                  mode="raised" type="submit" design="success"
                  // disabled={!props.replyInput || props.commentLoading}
            >
              {/* Login */}
              {/* {t('general.text11')} */}

              <span className="notPageFound__ButtonNameContainer">
              <img className="notPageFound__Icon" src={LoginIcon} alt='icon'/> 
              <span>{t('general.text11', 'Login')}</span>
            </span>

            </Button>
          </a>

          <a className="notPageFound__linkButton" href={authSignupPageLink} >
            <Button
                  mode="raised" type="submit" design="success"
                  // disabled={!props.replyInput || props.commentLoading}
            >
              {/* Signup */}
              {/* {t('general.text12')} */}

              <span className="notPageFound__ButtonNameContainer">
              <img className="notPageFound__Icon" src={SignupIcon} alt='icon'/> 
              <span>{t('general.text12', 'Signup')}</span>
              </span>
            </Button>
          </a>
        </div>
          {/* <a href={authPageLink}>
            <button>login-page</button>
            </a>
          <a href={authSignupPageLink}>
            <button>signup-page</button>
          </a> */}
        </div>
      </div>
    )
  } else {
    postMessageRecieveBody = (
      <div>
        {/* <div>auth-handle-message</div> */}
      </div>
    );
  }

  return (
    <Fragment>
      <div>{postMessageRecieveBody}</div>

      {messageData && messageData.shareFile && (
        <img className='resizerImage'
          // style={resizedFile ? {opacity: "0.5"} : null}
          style={{height: "100px"}}
          src={URL.createObjectURL(messageData.shareFile)}
          alt="for share"
          // onClick={() => { dispatch('SET_RESIZERSELECTED', item) }}
        />
      )}
    </Fragment>
  );
};

export default PostMessageRecieve;
