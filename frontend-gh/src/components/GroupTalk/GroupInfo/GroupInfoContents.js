import React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import { getUserImageUrl } from '../../../util/user';
import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
import SampleImage from '../../Image/person-icon-50.jpg';
import GroupImage from '../../../images/group-image-50.jpg';

import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './GroupInfoContents.module.css';

const GroupInfoContents = (props) => {
  console.log('GroupInfoContents.js-props', props);

  const { 
    groupInfo,
    // creatorInfo,
    // usersData,
    groupAllMemberList,
    groupUserInfo,
    editFavoriteGroupsHandler,
    editFavoriteGroupsResult,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  const [creatorImageUrl, setCreatorImageUrl] = useState('');
  const [groupImageUrl, setGroupImageUrl] = useState('');

  useEffect(() => {
    if (store.groupMemberImageUrls.length > 0) {
        const creatorImageUrlInfo = store.groupMemberImageUrls.find(urls => {
          return urls.userId === groupInfo.creatorUserId;
        });

        console.log('creatorImageUrlInfo', creatorImageUrlInfo);
        
        if (creatorImageUrlInfo) {
          setCreatorImageUrl(creatorImageUrlInfo.imageUrl);
        }
    }
  },[store.groupMemberImageUrls]);


  useEffect(() => {
    if (groupInfo && store.groupImageUrls.length > 0) {
      const groupImageUrl = store.groupImageUrls.find(image => {
        return image.groupRoomId === groupInfo.groupRoomId;
      });

    if (groupImageUrl && groupImageUrl.imageUrl) {
      setGroupImageUrl(groupImageUrl.imageUrl);
    } else {
      setGroupImageUrl('');
    }
  }

  if (groupInfo && store.groupImageUrls.length === 0) {
    setGroupImageUrl('');
  }

  },[groupInfo, store.groupImageUrls]);


  const addToFavoriteHandler = () => {
    const addedList = groupUserInfo.favoriteGroups.concat({
      groupRoomId: groupInfo.groupRoomId,
      addAt: Date.now(),
    });
    editFavoriteGroupsHandler(groupUserInfo.userId, addedList);
  };

  const deleteFromFavoriteHandler = () => {
    const deletedList = groupUserInfo.favoriteGroups.filter(favorite => {
      return favorite.groupRoomId !== groupInfo.groupRoomId;
    });
    editFavoriteGroupsHandler(groupUserInfo.userId, deletedList);
  };

  // const getCreatorImageUrlHandler = async (creatorId) => {
  //     const creatorImageUrl = await getUserImageUrl(
  //       BASE_URL,
  //       localStorage.getItem('token'),
  //       creatorId,
  //     );
  //     if (creatorImageUrl) {
  //       setCreatorImageUrl(creatorImageUrl.imageUrl)
  //       // console.log('creatorImageUrl', creatorImageUrl)
  //     }
  // };

  const isInFavorite = groupUserInfo.favoriteGroups.find(favorite => {
    return favorite.groupRoomId === groupInfo.groupRoomId;
  });

  const creatorInfo = groupAllMemberList.find(element => {
    return element.userId === groupInfo.creatorUserId;
  });


  const lsNameDataList = localStorage.getItem('lsNameDataList');

  let nameData;
  if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
    nameData = JSON.parse(lsNameDataList).find(ele => {
      return ele.userId === groupInfo.creatorUserId;
    });
  }


  const groupInfoContentsBody = (
    <div>
      <div className={classes.listElement}>
        <div>
          {t('groupTalk.text10', 'Group Name')}: 
        </div>
        <div className={classes.listElementContent}>
          <span className={classes.groupInfoNameContainer}>
            <span className={classes.groupInfoName}>{groupInfo.groupName}</span>
            <Img 
              className={classes.groupInfoImage}
              src={groupImageUrl ? groupImageUrl : GroupImage} 
              // height="30" 
              alt="group-img" 
            />
          </span>
        </div>
      </div>

      <div className={classes.listElement}>
        <div>
          {t('groupTalk.text2', 'Descriptions')}: 
        </div>
        <div className={classes.listElementContent}>
          {groupInfo.description}
        </div>
      </div>

      <div className={classes.listElement}>
        <div>
          {t('groupTalk.text22', 'Keywords')}:
        </div>
        <div>
          <ul style={{display: "inline-block"}}>
            {groupInfo.keywords.map(word => {
                return (
                <span key={word} className={classes.listElementContent}>
                  {word}, </span>
                );
            })}
          </ul>
        </div>
      </div>

      <div className={classes.listElement}>
        {t('groupTalk.text1', 'Creator')}:
        <div className="groupTalkTextList-joinModalCreator">
            {/* <Img 
              className={classes.groupCreatorImage}
              src={creatorImageUrl ? creatorImageUrl : SampleImage} 
              // height="25" 
              alt='user-img'
            /> */}
            {localStorage.getItem('userId') && nameData?.imageUrl && (
              <Img className={classes.groupCreatorImage}
                // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
                src={nameData.imageUrl} 
              />
            )}
            {localStorage.getItem('userId') && !nameData?.imageUrl && (
              <Img className={classes.groupCreatorImage}
                // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
                src={SampleImage} 
              />
            )}
            <div className={classes.listElementContent}>
              {/* {creatorInfo.name} */}
              {localStorage.getItem('userId') && nameData && (
                <span>
                  {nameData.name}
                </span>
              )}
            </div>
        </div>
      </div>

      {/* <div>
        group-members:
      </div> */}

      <br/>
      <div>
        {/* some-functionality */}

        {isInFavorite
          ? (
              <div className={classes.buttonSmall}>
                <Button mode="raised" type="submit"
                  onClick={deleteFromFavoriteHandler}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  {/* Delete from Favorite */}
                  {t('groupTalk.text31', 'Delete from Favorite')}
                </Button>
              </div>
            ) 
          : (
              <div className={classes.buttonSmall}>
                <Button mode="raised" type="submit"
                  onClick={addToFavoriteHandler}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  {/* Add to Favorite */}
                  {t('groupTalk.text38', 'Add to Favorite')}
                </Button>
              </div>
            )
         }

        <div>
          {isLoading && <Loader />}
        </div>
        <div className="groupTalk__createResult">
          {editFavoriteGroupsResult}
        </div>

        {/* <div>favorite-group-list</div>
        <ul>{groupUserInfo.favoriteGroups.map(favorite => {
          // console.log(favorite)
          return (
            <div key={favorite.groupRoomId}>{favorite.groupRoomId}</div>
              );
            })}
        </ul> */}

      </div>
    </div>

    
  );



  return (
    <Fragment>
      {groupInfoContentsBody}
    </Fragment>
  )

}

export default GroupInfoContents;