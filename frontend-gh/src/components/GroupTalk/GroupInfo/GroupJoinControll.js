import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import GroupInfoModal from './GroupInfoModal';
import Loader from '../../Loader/Loader';

import SampleImage from '../../Image/person-icon-50.jpg';

import classes from './GroupJoinControll.module.css'


const GroupJoinControll = (props) => {
  console.log('GroupJoinControll-props', props);

  const [t] = useTranslation('translation');


  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);


  // useEffect(() => {
  //   // scrollToTop('group-info')

  //   let userIsMemberIndex;
  //   if (props.groupAllMemberList.length > 0) {
  //     userIsMemberIndex = props.groupAllMemberList.findIndex(element => {
  //       return element.userId === props.userId;
  //     });
  //   }
  //   // console.log(userIsMemberIndex);
  //   if (userIsMemberIndex > -1) {
  //     props.getIsMemberHandler(true);
  //   } else {
  //     props.getIsMemberHandler(false);
  //   }

  // },[props.groupAllMemberList]);

  
  //// to delete group join modal after join success 
  useEffect(() => {
    if (props.isMember) {
      setShowJoinModal(false);
    }
  }, [props.isMember]);



  const showJoinModalHandler = () => {
    setShowJoinModal(!showJoinModal);
  }

  const showDeleteMemberModalHandler = () => {
    setShowDeleteMemberModal(!showDeleteMemberModal);
  }



  
  let joinGroupButton;
  let userIsMemberIndex;
  
  if (props.groupAllMemberList.length > 0) {
    userIsMemberIndex = props.groupAllMemberList.findIndex(element => {
      return element.userId === props.userId;
    });
  }

  if (userIsMemberIndex < 0) {
    if (props.isAuth) {
      joinGroupButton = (
        <div className="groupTalkTextList__joinGroupButton groupTalk__buttonSmall">
          <Button mode="raised" design="" type="submit"
            // disabled={props.isLoading}
            onClick={() => {
              if (!props.isAuth) {
                props.setShowAuthModal(true);
              } else {
                showJoinModalHandler();
              }
            }}
          >
            {t('groupTalk.text7', 'Join group')}
          </Button>
        </div>
        
      );
    }
  } 

  if (userIsMemberIndex >= 0 && 
      props.userId !== props.groupInfo.creatorUserId
  ) {
    joinGroupButton = (
      <div className="groupTalkTextList__joinGroupButton groupTalk__buttonSmall">
        <Button mode="flat" design="" type="submit"
        onClick={showDeleteMemberModalHandler}
        >
          {t('groupTalk.text6', 'Leave from menber')}
        </Button>

        <div>
          {props.deleteMemberResult}
        </div>

      </div>
    )
  }

  if (props.isLoading) {
    joinGroupButton = null;
  }







let joinModalContent;
let joinModalBody;

if (showJoinModal) {
  // const creatorInfo = props.usersData.find(element => {
  //   return element.userId === props.groupInfo.creatorUserId;
  // });
  
  joinModalContent = (
    <div>
        <div>
          {/* Do You Want to Join This Group? */}
          {t('groupTalk.text9')}
        </div>
        <div className="groupTalkTextList-joinModalElement">
          {/* Group Name: {props.groupInfo.groupName} */}
          {t('groupTalk.text10')}: {props.groupInfo.groupName}
        </div>
        {/* <div className="groupTalkTextList-joinModalElement">
          <div className="groupTalkTextList-joinModalCreator">
            <div>
              Creator: {creatorInfo.name}
              {t('groupTalk.text1')}: {creatorInfo.name}
            </div>
            <img src={creatorInfo.imageUrl? creatorInfo.imageUrl : SampleImage} height="25" alt='user-img'></img>
            <Img src={creatorInfo.imageUrl? creatorInfo.imageUrl : SampleImage} height="25" alt='user-img' />
          </div>
        </div> */}
        {props.groupInfo.description ?
          <div className="groupTalkTextList-joinModalElement">
            {/* Description: {props.groupInfo.description} */}
            {t('groupTalk.text2')}: {props.groupInfo.description}
          </div>
        : null
        }
        <div className="groupTalkTextList-joinModalElement groupTalk__buttonSmall">
          <Button mode="flat" design="" type="submit" 
            disabled={props.isLoading}
            loading={props.isLoading}
            onClick={showJoinModalHandler}
          >
            {t('general.text1', 'Cancel')}
          </Button>
          <Button mode="raised" design="" type="submit"
            disabled={props.isLoading}
            loading={props.isLoading}
            onClick={() =>{props.joinGroupHandler(props.groupTalkId)}}
          >
            {/* Join Group */}
            {t('groupTalk.text7')}
          </Button>
  
          {props.isLoading && <div><Loader /></div>}
            
        </div>    
    </div>
  );

  joinModalBody = (
    <GroupInfoModal 
      showModalHandler={showJoinModalHandler}
      modalContent={joinModalContent}
    />
  )
}





const deleteMemberModalContent = (
  <div>
    <div>
    {/* Is it no problem to delete you from members of this group? */}
    {t('groupTalk.text5')}
    </div>
    <div className="groupTalkTextList-joinModalElement groupTalk__buttonSmall">
      <Button mode="flat" design="" type="submit" 
        disabled={props.isLoading}
        loading={props.isLoading}
        onClick={showDeleteMemberModalHandler}
      >
        {t('general.text1', 'Cancel')}
      </Button>
      <Button mode="raised" design="" type="submit" 
        disabled={props.isLoading}
        loading={props.isLoading}
        onClick={() => {
          props.deleteGroupMemberHandler(props.joinGroupId, props.userId)
        }}
      >
        {/* Leave from Member */}
        {t('groupTalk.text6')}
      </Button>
    </div>
    {props.isLoading && <Loader />}
    <div>
      {props.deleteMemberResult}
    </div>
  </div>
);


let deleteMemberModalbody;

if (showDeleteMemberModal) {
  deleteMemberModalbody =(
    <GroupInfoModal 
      showModalHandler={showDeleteMemberModalHandler}
      modalContent={deleteMemberModalContent}
    />
  )
}




  return (
    <div >
      {joinGroupButton}

      {joinModalBody}

      {deleteMemberModalbody}

    </div>
  );
}

export default GroupJoinControll;