import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import DeleteGroupForm from '../EditGroup/DeleteGroupForm';
import GroupImageControll from './GroupImageControll';
import GroupImageUpload from './GroupImageUpload';
import { getUserImageUrl } from '../../../util/user';
import { getLocalTimeElements } from '../../../util/timeFormat';

import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
import SampleImage from '../../Image/person-icon-50.jpg';
import GroupImage from '../../../images/group-image-50.jpg';

import '../../../pages/GroupTalk/GroupTalk.css';

import classes from './GroupListItem.module.css'

const GroupListItem = (props) => {
  // console.log('grouplistItem.js props', props);

  const { 
    group,
    showGroupTalkTextHandler,
    getGroupInfoHandler,
    updateGroupStartHandler,
    usersData,
    userId,
    deleteGroupHandler,
    deleteGroupResult,
    isLoading,
    // creatorInfo,
    // displayTime,
  } = props;

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store in GroupListItem.js', store);
  // const groupImageUrls = store.groupImageUrls;
  // console.log('groupImageUrls', groupImageUrls);

  const [showDescription, setShowDescription] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [showKeywords, setShowKeywords] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState();
  const [creatorImageUrl, setCreatorImageUrl] = useState('');
  
  const [groupImageUrl, setGroupImageUrl] = useState('');

  useEffect(() => {
    if (!creatorInfo && usersData.length > 0 && showDescription) {
      const creatorInfo = usersData.find(element => {
        return element.userId === group.creatorUserId
      });

      setCreatorInfo(creatorInfo);
      // console.log('creatorInfo', creatorInfo);

      if (creatorInfo && creatorInfo.imagePath) {
        getCreatorImageUrlHandler(creatorInfo.userId);
      }
    }
  },[usersData, showDescription]);

  useEffect(() => {
    if (group && store.groupImageUrls.length > 0) {
      // console.log('group, store.groupImageUrls', group, store.groupImageUrls);
      const groupImageUrl = store.groupImageUrls.find(image => {
        return image.groupRoomId === group.groupRoomId;
      });

      // console.log('groupImageUrl', groupImageUrl)

      if (groupImageUrl && groupImageUrl.imageUrl) {
        setGroupImageUrl(groupImageUrl.imageUrl);
      } else {
        setGroupImageUrl('');
      }
    }

    if (group && store.groupImageUrls.length === 0) {
      setGroupImageUrl('');
    }

  },[group, store.groupImageUrls]);


  const showDescriptionHandler = (id) => {
    if (!showDescription) {
      setSelectedGroupId(id);
      setShowDescription(true);
    } 
    if (showDescription && selectedGroupId === id) {
      setSelectedGroupId(id);
      setShowDescription(false);
    }
    if (showDescription && selectedGroupId !== id) {
      setSelectedGroupId(id);
      setShowDescription(true);
    }

    // setShowDescription(!showDescription);
  };

  const showDeleteModalHandler = () => {
    setShowDeleteModal(!showDeleteModal);
  }


  const getCreatorImageUrlHandler = async (creatorId) => {
    const creatorImageUrl = await getUserImageUrl(
      BASE_URL,
      localStorage.getItem('token'),
      creatorId,
    );
    if (creatorImageUrl) {
      setCreatorImageUrl(creatorImageUrl.imageUrl)
      // console.log('creatorImageUrl', creatorImageUrl)
    }
  };

  // const getNewImageUrl = (imageUrl) => {
  //   // console.log('getNewImageUrl')
  //   setGroupImageUrl(imageUrl);
  // }



  const createDate = getLocalTimeElements(group.createdAt)
  // console.log(createDate);
  const displayTime = createDate.year + '-' + createDate.month + '-' + createDate.day;


  const groupListItemBody = (
    <div>
      <span className="groupList-groupName"
        onClick={() => {
          showGroupTalkTextHandler(group.groupRoomId);
          getGroupInfoHandler(group.groupRoomId); 
        }}
      >
        <span className={classes.groupListNameContainer}>
          <span className={classes.groupListName}>{group.groupName}</span> 
          <Img src={groupImageUrl ? groupImageUrl : GroupImage} height="30" alt="group-img" />
        </span>
      </span>
      
      <div className="groupList-listElement" 
        onClick={() => { setShowKeywords(!showKeywords); }}
      >
        <ul style={{display: "inline-block"}}>
          <span>
            {/* keywords:{' '} */}
            {t('groupTalk.text22', 'Keywords')}:{' '}
          </span>

          {!showKeywords ?
            group.keywords.slice(0, 3).map(word => {
              return (<span key={word}> {word}, </span>);
            })
          : 
            group.keywords.map(word => {
              return (<span key={word}> {word}, </span>);
            })
        }
        </ul>
 
        {group.keywords.length > 3 && !showKeywords && <span> &#9662;</span>}
      </div>

      <div className="groupList-listElement"
        onClick={() => {
          showDescriptionHandler(group.groupRoomId)
        }}
      >
        {/* {group.description && group.description.length > 40 ?
          <span>
            Description: {group.description.slice(0, 40)}..... &#9662;
            {t('groupTalk.text2')}: {group.description.slice(0, 40)}..... &#9662;
          </span>
        : 
          <span>
            Description: {group.description} &#9662;
            {t('groupTalk.text2')}: {group.description} &#9662;
          </span>
        } */}
        {/* more information &#9662; */}
        {t('groupTalk.text21', 'more information')} &#9662;
      </div>
      
      {showDescription && selectedGroupId === group.groupRoomId ? 
        <div className="groupList-listElement"  onClick={() => {
           showDescriptionHandler(group.groupRoomId)
          }}
        >
      
      {creatorInfo && 
        <span className="groupList-creatorContainer groupList-listElement">
          <span>
            {/* creator: {creatorInfo.name} */}
            {t('groupTalk.text1')}:  {creatorInfo.name}
          </span>
          <span className="groupList-creatorImage">
            {/* <img src={creatorInfo.imageUrl ? creatorInfo.imageUrl : SampleImage} height="25" alt='user-img'></img> */}
            {/* <Img src={creatorInfo.imageUrl ? creatorInfo.imageUrl : SampleImage} height="25" alt='user-img' /> */}
            <Img src={creatorImageUrl ? creatorImageUrl : SampleImage} height="25" alt='user-img' />
          </span>
        </span>
      }

          <div className="groupList-listElement">
            {/* Description: {group.description} */}
            {t('groupTalk.text2')}: {group.description} 
          </div>

          <div className="groupList-listElement">
            {/* Members: {group.allMemberUserIds.length}, Total Visits: {group.totalVisits} */}
            {t('groupTalk.text23', 'Members')}:{' '}{group.allMemberUserIds.length},{' '}{t('groupTalk.text24', 'Total visits')}:{' '}{group.totalVisits}
          </div>

          <div className="groupList-listElement">
            {/* creation date: {displayTime} */}
            {t('groupTalk.text3')}: {displayTime}
          </div>
          
        </div> 
      : null
      }

      {group.creatorUserId === userId ?
        <div className="groupList-listElement ">
          <Button mode="flat" design="" type="submit" 
            onClick={() => {
              updateGroupStartHandler(group);
            }}
          >
            {/* Edit group info */}
            {t('groupTalk.text4')}
          </Button>
        </div>
      : null
      }

      {group.creatorUserId === userId ?
        <div className="groupList-listElement ">
          <Button mode="flat" design="" type="submit" 
            onClick={showDeleteModalHandler}
          >
            {/* Delete Group */}
            {t('groupTalk.text25', 'Delete Group')}
          </Button>
        </div>
      : null
      }


      {group.creatorUserId === userId && 
        <div className="groupList-listElement ">
          <GroupImageControll
            userId={userId}
            group={group}
            groupImageUrl={groupImageUrl}
          />
        </div>
      }
 
      </div>
    );

    // const deleteGroupModalBody = (
    //   <div>
    //     <div>Delete Group?</div>
    //     <div className="groupList-listElement">
    //       <Button mode="raised" design="" type="submit" 
    //         onClick={() => {
    //           deleteGroupHandler(group.groupRoomId, userId);
    //         }}
    //       >
    //         Delete Group
    //       </Button>
    //     </div>

    //     {isLoading && <Loader />}

    //     <div className="groupTalk__createResult">
    //       {deleteGroupResult}
    //     </div>
    //   </div>
    // );

  return (
      <Fragment>

        <DeleteGroupForm
          showDeleteModal={showDeleteModal}
          showDeleteModalHandler={showDeleteModalHandler}
          deleteGroupResult={deleteGroupResult}
          isLoading={isLoading}
          group={group}
          userId={userId}
          deleteGroupHandler={deleteGroupHandler}
        />
     

        {groupListItemBody}
        </Fragment>
  );
}


export default GroupListItem;