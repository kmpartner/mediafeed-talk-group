import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import DeleteGroupForm from '../EditGroup/DeleteGroupForm';
import GroupImageUpload from './GroupImageUpload';
import { getUserImageUrl } from '../../../util/user';
import { getLocalTimeElements } from '../../../util/timeFormat';

import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
import SampleImage from '../../Image/person-icon-50.jpg';

import '../../../pages/GroupTalk/GroupTalk.css';

const GroupImageControll = (props) => {
  // console.log('grouplistItem.js props', props);

  const { 
    group,
    // userId,
    groupImageUrl
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store in GroupImageControll.js', store);
  // const groupImageUrls = store.groupImageUrls;
  // console.log('groupImageUrls', groupImageUrls);

  // const [groupImageUrl, setGroupImageUrl] = useState('');



  const getNewImageUrl = (imageUrl) => {
    // console.log('getNewImageUrl')
    // setGroupImageUrl(imageUrl);
  }

  const updateGroupImageUrls = (imageUrlObj) => {
    const withoutImageUrlList = store.groupImageUrls.filter(image => {
      return image.groupRoomId !== imageUrlObj.groupRoomId;
    });
    
      if (imageUrlObj.imageUrl) {
        const addedImageUrls = withoutImageUrlList.concat(imageUrlObj);
        dispatch('SET_GROUP_IMAGEURLS', addedImageUrls);
      } else {
        dispatch('SET_GROUP_IMAGEURLS', withoutImageUrlList);
      }

  };


  const groupImageControllBody = (
    <div>
      <GroupImageUpload
        userId={props.userId}
        token={props.token}
        isAuth={props.isAuth}
        // userImageUrl={userImageUrl}
        userImageUrl=''
        groupImageUrl={groupImageUrl}
        getNewImageUrl={getNewImageUrl}
        // getNewImageUrl={() => {}}
        groupRoomId={group.groupRoomId}
        // hideImageUpdateButton={hideImageUpdateButton}
        hideImageUpdateButton={() => {}}
        updateGroupImageUrls={updateGroupImageUrls}
      />
    </div>
  );



  return (
      <Fragment>
        {groupImageControllBody}
      </Fragment>
  );
}

export default GroupImageControll;