import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
import { getLocalTimeElements } from '../../../util/timeFormat';

import { getUserDescription } from '../../../util/user'

import SampleImage from '../../Image/person-icon-50.jpg';

import classes from './GroupInfoMemberItem.module.css'

import { GQL_URL, BASE_URL } from '../../../App';

const GroupInfoMembers = (props) => {
  console.log('GroupInfoMembers-props', props);

  const {
    member,
    groupAllMemberList,
    joinGroupOnlineMember,
    usersData,
    allMemberUserIds,
    userId
  } = props;

  const [t] = useTranslation('translation');

  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [userDescription, setUserDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

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
  // useEffect(() => {
  //   if (props.isMember) {
  //     setShowJoinModal(false);
  //   }
  // }, [props.isMember]);


  const showAllMembersHandler = () => {
    setShowAllMembers(!showAllMembers);
  };

  const hideAllMembersHandler = () => {
    setShowAllMembers(false);
  };


  const showSmallModalHandler = () => {
    setShowSmallModal(!showSmallModal);
  };

  const setSelectedUserIdHandler = (userId) => {
    
    if (selectedUserId === userId) {
      setSelectedUserId('');
    } 
    else {
      setSelectedUserId(userId);
    }

  };

  const getUserDescriptionHandler = (userId) => {
    setUserDescription('');

    if (!selectedUserId || selectedUserId !== userId) {
      getUserDescription(
        BASE_URL,
        localStorage.getItem('token'),
        userId
      )
      .then(res => {
        console.log(res);
  
        setUserDescription(res.data.user.description);
        setSelectedUserIdHandler(userId);
      })
      .catch(err => {
        console.log(err);
      })
    }
  };




  let memberListItemBody;

  if (groupAllMemberList.length > 0) {

    const isOnline = joinGroupOnlineMember.find(element => {
      return element.userId === member.userId;
    });
    
    const userInfo = usersData.find(element => {
      return element.userId === member.userId;
    });

    const userInfo2 = allMemberUserIds.find(element => {
      return element.userId === member.userId;
    });

    const userCreateDate = getLocalTimeElements(member.createdAt).dateDisplay;
    // console.log(userCreateDate);

    const joinDate = getLocalTimeElements(userInfo2.addAt).dateDisplay;
    // console.log(getLocalTimeElements(joinDate));


    memberListItemBody = (
      <div>
      <div key={member.userId} className="groupTalkTextList-allMemberElement"
        onClick={() => {
          getUserDescriptionHandler(member.userId);
          setSelectedUserIdHandler(member.userId);
        }}
      >
        {/* {member.userId}  */}
        <div className="groupTalkTextList-memberListElement">
        {member.name}
        </div>
        <div className="groupTalkTextList-memberListElement">
          {/* <img src={userInfo.imageUrl? userInfo.imageUrl : SampleImage} height="25" alt='user-img'></img> */}
          <Img 
            className={classes.grupInfoMemberItemImage}
            src={userInfo.imageUrl? userInfo.imageUrl : SampleImage} 
            // height="25" 
            alt='user-img' 
          />
        </div>
        <div className="groupTalkTextList-memberListElement">
          {isOnline ? ' (online)' : ''}
        </div>

        <div>&#9662;</div>
      </div>

      {selectedUserId && selectedUserId === member.userId ?
        <div className="groupTalkTextList-descriptionContainer">
          {userDescription}

          {/* <div>user-created-at: {userCreateDate}</div> */}
          <div className="groupTalkTextList-descriptionDate">
            group join date: {joinDate}
          </div>

            {member.userId !== userId ?
              <div className="groupTalkTextList-TalkPageButton">
                <Link to={`/talk-page/?grouptotalk=${member.name}`} className="">
                  <Button
                    mode="flat" type="submit" design=""
                    // disabled={!props.replyInput || props.commentLoading}
                  >
                    send text in Talk Page
                  </Button>
                </Link>
              </div>
            : null
            }

        </div>
      : null
      }
    </div>
    );
  }

  // let allMembers;
  // if (props.groupAllMemberList.length > 0) {
  //   allMembers = (
  //     <div>
  //       {/* <div onClick={hideAllMembersHandler}>hide-member</div> */}
  //       <ul>
  //         {props.groupAllMemberList.map((member) => {
  //           // console.log(member);
  //           const isOnline = props.joinGroupOnlineMember.find(element => {
  //             return element.userId === member.userId;
  //           });
            
  //           const userInfo = props.usersData.find(element => {
  //             return element.userId === member.userId;
  //           });

  //           const userInfo2 = props.allMemberUserIds.find(element => {
  //             return element.userId === member.userId;
  //           });

  //           const userCreateDate = getLocalTimeElements(member.createdAt).dateDisplay;
  //           // console.log(userCreateDate);

  //           const joinDate = getLocalTimeElements(userInfo2.addAt).dateDisplay;
  //           // console.log(getLocalTimeElements(joinDate));

  //           return (
  //             <div>
  //               <div key={member.userId} className="groupTalkTextList-allMemberElement"
  //                 onClick={() => {
  //                   getUserDescriptionHandler(member.userId);
  //                   setSelectedUserIdHandler(member.userId);
  //                 }}
  //               >
  //                 {/* {member.userId}  */}
  //                 <div className="groupTalkTextList-memberListElement">
  //                 {member.name} 
  //                 </div>
  //                 <div className="groupTalkTextList-memberListElement">
  //                   {/* <img src={userInfo.imageUrl? userInfo.imageUrl : SampleImage} height="25" alt='user-img'></img> */}
  //                   <Img src={userInfo.imageUrl? userInfo.imageUrl : SampleImage} height="25" alt='user-img' />
  //                 </div>
  //                 <div className="groupTalkTextList-memberListElement">
  //                   {isOnline ? ' (online)' : ''}
  //                 </div>

  //                 <div>&#9662;</div>
  //               </div>

  //               {selectedUserId && selectedUserId === member.userId ?
  //                 <div className="groupTalkTextList-descriptionContainer">
  //                   {userDescription}
 
  //                   {/* <div>user-created-at: {userCreateDate}</div> */}
  //                   <div className="groupTalkTextList-descriptionDate">
  //                     group join date: {joinDate}
  //                   </div>

  //                     {member.userId !== props.userId ?
  //                       <div className="groupTalkTextList-TalkPageButton">
  //                         <Link to={`/talk-page/?grouptotalk=${member.name}`} className="">
  //                           <Button
  //                             mode="flat" type="submit" design=""
  //                             // disabled={!props.replyInput || props.commentLoading}
  //                           >
  //                             send text in Talk Page
  //                           </Button>
  //                         </Link>
  //                       </div>
  //                     : null
  //                     }

  //                 </div>
  //               : null
  //               }
  //             </div>
  //           )
  //         }
  //         )}
  //       </ul>
  //     </div>
  // );
  // }



  return (
    <div >

      <div id="group-info" className="groupTalkTextList-groupInfo">
        {memberListItemBody}
      </div>
      
    </div>
  );
}

export default GroupInfoMembers;