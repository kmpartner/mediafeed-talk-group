import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

// import AutoSuggestVideoTextTalk from '../../AutoSuggest/AutoSuggestVideoTextTalk';
import Button from '../../Button/Button';
import { 
  addAcceptUserId,
  deleteAcceptUserId,
  addRequestingUserId,
} from '../../../util/talk-permission';

import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
// import './VideoTextTalk.css'

// import SampleImage from '../../Image/person-icon-50.jpg';


const TalkUserListPermission = props => {
  // console.log('UserTalkListPermission.js-props', props);
  const {
    // userId,
    destUserId,
    isRequesting,
    isRequested,
    isAccepted,
    isAccept,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // props.getUserTextTalkListHandler();
  },[]); 


  const addAcceptUserIdHandler = async (url, token, acceptUserId) => {
    try {

      setIsLoading(true);

      const result = await addAcceptUserId(url, token, acceptUserId);
      
      console.log(result);

      if (result.data) {
        dispatch('SET_TALKPERMISSION', result.data);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  };


  const deleteAcceptUserIdHandler = async (url, token, deleteUserId) => {
    try {
      setIsLoading(true);

      const result = await deleteAcceptUserId(url, token, deleteUserId);
      
      console.log(result);

      if (result.data) {
        dispatch('SET_TALKPERMISSION', result.data);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  

  const addRequestingUserIdIdHandler = async (url, token, destUserId) => {
    try {
      setIsLoading(true);

      const result = await addRequestingUserId(url, token, destUserId);
      
      console.log(result);

      if (result.data) {
        dispatch('SET_TALKPERMISSION', result.data);
      }

      setIsLoading(false);

    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  };


  let acceptButton;
  let unAcceptButton;
  
  if (isAccept) {
    acceptButton = null;

    unAcceptButton = null;
    // unAcceptButton = (
    //   <button onClick={() => {
    //     deleteAcceptUserIdHandler(
    //       BASE_URL,
    //       localStorage.getItem('token'),
    //       destUserId,
    //     );
    //   }}
    // >
    //   delete-from-accept-user
    // </button>
    // );

  } else {
    unAcceptButton = null;
    // acceptButton = (
    //   <button onClick={() => {
    //     addAcceptUserIdHandler(
    //       BASE_URL,
    //       localStorage.getItem('token'),
    //       destUserId,
    //     );
    //   }}>
    //     accept-user-to-recieve, accept
    //   </button>
    // );
    if (isRequested || isRequesting || isAccepted) {
      acceptButton = (
        <Button design='raised' mode='' size='smaller'
          onClick={() => {
            addAcceptUserIdHandler(
              BASE_URL,
              localStorage.getItem('token'),
              destUserId,
            );
          }}
        >
          Accept User
        </Button>
      );
    }
  }

  let requestButton;

  if (!(isAccepted || isRequesting)) {
    requestButton = (
      <Button design='raised' mode='' size='smaller'
      onClick={() => {
        addRequestingUserIdIdHandler(
          BASE_URL,
          localStorage.getItem('token'),
          destUserId,
        );
      }}>
        Send request to write
      </Button>
    )
  }

  let talkUserListPermissionBody = (
    <span>
      {isRequesting ? <strong>Requesting</strong> : ''}
      {/* {', '}
      {isRequested ? 'requested' : 'not-requested'}
      {', '}
      {isAccept ? 'accept' : 'not-accept'}
      {','}
      {isAccepted ? 'accepted' : 'not-accepted'} */}


      {acceptButton}

      {/* {unAcceptButton} */}

      {requestButton}

    </span>
  )


  return (
    <Fragment>
      {talkUserListPermissionBody}
    </Fragment>
    );
}

export default TalkUserListPermission;