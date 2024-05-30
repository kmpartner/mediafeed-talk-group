import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";
import _ from 'lodash';

import Button from '../../Button/Button';
import DeleteGroupForm from '../EditGroup/DeleteGroupForm';
import GroupImageControll from './GroupImageControll';
// import GroupImageUpload from './GroupImageUpload';
import { getUserImageUrl } from '../../../util/user';
import { getLocalTimeElements } from '../../../util/timeFormat';
import { addRecentVisitGroupId } from '../../../util/user-recent-visit';

import { useStore } from '../../../hook-store/store';
import { getGroupCreatorNameData } from '../../../util/group/group-user';

import { BASE_URL, SOCKET_GROUP_URL } from '../../../App';
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
  const { 
    groupCreatorInfoList,
   } = store.groupStore;
   
  // console.log('store in GroupListItem.js', store);
  // const groupImageUrls = store.groupImageUrls;
  // console.log('groupImageUrls', groupImageUrls);

  const [showDescription, setShowDescription] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [showKeywords, setShowKeywords] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [creatorInfo, setCreatorInfo] = useState();
  // const [creatorImageUrl, setCreataorImageUrl] = useState('');
  const [groupImageUrl, setGroupImageUrl] = useState('');


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


  useEffect(() => {
    if (localStorage.getItem('userId') && selectedGroupId && showDescription) {
      getGroupCreatorNameDataHandler(group);
    }
  },[selectedGroupId, showDescription]);


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



  const addVisitGroupIdHandler = async (groupId, creatorId) => {
    try {
      if (localStorage.getItem('userId') && creatorId !== localStorage.getItem('userId')) {
        await addRecentVisitGroupId(
          BASE_URL, 
          localStorage.getItem('token'),
          groupId, 
          creatorId
        );
        // console.log(resData);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const clickGroupNameHandler = (group) => {
    showGroupTalkTextHandler(group.groupRoomId);
    getGroupInfoHandler(group.groupRoomId); 
    addVisitGroupIdHandler(
      group.groupRoomId,
      group.creatorUserId,
    );
  };


  const getGroupCreatorNameDataHandler = async (group) => {
    try {

      const isInNameList = groupCreatorInfoList.find(element => {
        return element.userId === group.creatorUserId;
      });

      if (isInNameList) {
        return;
      }

      const resData = await getGroupCreatorNameData(
        SOCKET_GROUP_URL,
        localStorage.getItem('token'),
        group.creatorUserId,
      );

      console.log(resData);

      if (resData?.data?.length > 0) {
        const addedList = groupCreatorInfoList.concat(resData.data);
        const uniqList = _.uniqBy(addedList, 'userId');
        dispatch('SET_GROUPCREATORINFOLIST', uniqList);
      }

    } catch(err) {
      console.log(err);
      throw err;
    }
  };



  const createDate = getLocalTimeElements(group.createdAt)
  // console.log(createDate);
  const displayTime = createDate.year + '-' + createDate.month + '-' + createDate.day;

  let creatorInfo;

  if (group) {
    creatorInfo = groupCreatorInfoList.find(element => {
      return element.userId === group.creatorUserId;
    });
  }




  const groupListItemBody = (
    <div>
      <span className="groupList-groupName">
        <span className={classes.groupListNameContainer}>
          <span className={classes.groupListName}
            onClick={() => { clickGroupNameHandler(group); }}
          >
            {group.groupName}
          </span> 
          <Img
            className={classes.groupListImage}
            src={groupImageUrl ? groupImageUrl : GroupImage} 
            height="30" 
            alt="group-img" 
            onClick={() => { clickGroupNameHandler(group); }}
          />
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
        // onClick={() => {
        //   showDescriptionHandler(group.groupRoomId)
        // }}
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
        <span className={classes.groupListMoreInfo}
          onClick={() => {
            showDescriptionHandler(group.groupRoomId)
          }}
        >
          {t('groupTalk.text21', 'more information')} &#9662;
        </span>
      </div>
      
      {showDescription && selectedGroupId === group.groupRoomId ? 
        <div className="groupList-listElement"  
          // onClick={() => {
          //   showDescriptionHandler(group.groupRoomId)
          // }}
        >
      
      {creatorInfo && 
        <span className="groupList-creatorContainer groupList-listElement">
          <span>
            {t('groupTalk.text1', 'creator')}:  
          </span>
          <span className="groupList-creatorImage">
            {/* <img src={creatorInfo.imageUrl ? creatorInfo.imageUrl : SampleImage} height="25" alt='user-img'></img> */}
            {/* <Img src={creatorInfo.imageUrl ? creatorInfo.imageUrl : SampleImage} height="25" alt='user-img' /> */}
            <Img 
              className={classes.groupListCreatorImage}
              src={creatorInfo.imageUrl ? creatorInfo.imageUrl : SampleImage} 
              // height="25" 
              alt='user-img' 
            />
          </span>
          <span>
            {creatorInfo.name}
          </span>
        </span>
      }

          <div className="groupList-listElement">
            {/* Description: {group.description} */}
            {t('groupTalk.text2')}: {group.description} 
          </div>

          <div className="groupList-listElement">
            {t('groupTalk.text23', 'Members')}:{' '}{group.allMemberUserIds.length},
            {' '}{t('groupTalk.text24', 'Total visits')}:{' '}{group.totalVisits}
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