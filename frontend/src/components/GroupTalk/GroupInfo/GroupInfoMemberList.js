import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Button from "../../Button/Button";
import GroupInfoMemberItem from "./GroupInfoMemberItem";
import GroupInfoModal from "./GroupInfoModal";
import Loader from '../../Loader/Loader';

import { getLocalTimeElements } from "../../../util/timeFormat";

import { getUserDescription, getUserImageUrl } from "../../../util/user";
import { useStore } from "../../../hook-store/store";

import SampleImage from "../../Image/person-icon-50.jpg";

import classes from './GroupInfoMemberList.module.css'

import { GQL_URL, BASE_URL } from "../../../App";

const GroupInfoMemberList = (props) => {
  console.log("GroupInfoMemberList-props", props);

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // console.log('store in GroupInfoMemberList', store);

  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [userDescription, setUserDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [memberImageUrlList, setMemberImageUrlList] = useState([]);
  const [confirmMemberDelete, setConfirmMemberDelete] = useState(false);

  useEffect(() => {
    if (props.groupAllMemberList && props.groupAllMemberList.length > 0) {
      getUserImageUrlsHandler();
    }
  }, [props.allMemberUserIds, props.groupAllMemberList]);

  let isCreator = false;
  if (
    props.userId &&
    props.groupInfo &&
    props.userId === props.groupInfo.creatorUserId
  ) {
    isCreator = true;
  }

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
      setSelectedUserId("");
    } else {
      setSelectedUserId(userId);
    }
  };

  const getUserDescriptionHandler = (userId) => {
    setUserDescription("");

    if (!selectedUserId || selectedUserId !== userId) {
      getUserDescription(BASE_URL, localStorage.getItem("token"), userId)
        .then((res) => {
          console.log(res);

          setUserDescription(res.data.user.description);
          setSelectedUserIdHandler(userId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getUserImageUrlsHandler = async () => {
    const imageUrlsList = [];

    for (const member of props.groupAllMemberList) {
      if (member.imagePath) {
        const userImageUrl = await getUserImageUrl(
          BASE_URL,
          localStorage.getItem("token"),
          member.userId
        );
        if (userImageUrl) {
          imageUrlsList.push(userImageUrl);
        }
      }
    }
    // console.log('imageUrlsList', imageUrlsList);

    if (imageUrlsList.length > 0) {
      setMemberImageUrlList(imageUrlsList);
      dispatch("SET_GROUPMEMBER_IMAGEURLS", imageUrlsList);
    }
  };

  // let onlineMembers;
  // if (props.joinGroupOnlineMember.length > 0) {
  //   onlineMembers = <ul>
  //     {props.joinGroupOnlineMember.map((member) => {
  //       return (
  //         <div key={member.userId}>
  //           {member.userId} {member.userName}
  //         </div>
  //       )
  //     }
  //     )}
  //   </ul>
  // }

  let deleteMemberBody;

  let allMembers;
  if (props.groupAllMemberList.length > 0) {
    allMembers = (
      <div>
        {/* <div onClick={hideAllMembersHandler}>hide-member</div> */}
        <ul>
          {props.groupAllMemberList.map((member) => {
            // console.log(member);
            const isOnline = props.joinGroupOnlineMember.find((element) => {
              return element.userId === member.userId;
            });

            // const userInfo = props.usersData.find(element => {
            //   return element.userId === member.userId;
            // });

            const userInfo2 = props.allMemberUserIds.find((element) => {
              return element.userId === member.userId;
            });

            const userCreateDate = getLocalTimeElements(member.createdAt)
              .dateDisplay;
            // console.log(userCreateDate);

            const joinDate = getLocalTimeElements(userInfo2.addAt).dateDisplay;
            // console.log(getLocalTimeElements(joinDate));

            let userImageUrl;
            if (memberImageUrlList.length > 0) {
              const imageUser = memberImageUrlList.find((ele) => {
                return ele.userId === member.userId;
              });
              // console.log('imageUser', imageUser);
              if (imageUser) {
                userImageUrl = imageUser.imageUrl;
              }
            }
            return (
              <div>
                {/* <GroupInfoMemberItem
                  member={member}
                  groupAllMemberList={props.groupAllMemberList}
                  joinGroupOnlineMember={props.joinGroupOnlineMember}
                  usersData={props.usersData}
                  allMemberUserIds={props.allMemberUserIds}
                  userId
                /> */}
                <div>
                  <div
                    key={member.userId}
                    className="groupTalkTextList-allMemberElement"
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
                      {/* <Img src={userInfo.imageUrl? userInfo.imageUrl : SampleImage} height="25" alt='user-img' /> */}
                      <Img
                        className={classes.grupInfoMemberListImage}
                        src={userImageUrl ? userImageUrl : SampleImage}
                        // height="25"
                        alt="user-img"
                      />
                    </div>
                    <div className="groupTalkTextList-memberListElement">
                      {isOnline ? " (online)" : ""}
                    </div>

                    <div>&#9662;</div>
                  </div>

                  {selectedUserId && selectedUserId === member.userId ? (
                    <div className="groupTalkTextList-descriptionContainer">
                      {userDescription}

                      {/* <div>user-created-at: {userCreateDate}</div> */}
                      <div className="groupTalkTextList-descriptionDate">
                        group join date: {joinDate}

                      </div>

                      {member.userId !== props.userId ? (
                        <div>
                        <div className="groupTalkTextList-TalkPageButton">
                          <Link
                            to={`/talk-page/?grouptotalk=${member.name}`}
                            className=""
                          >
                            <Button
                              mode="flat"
                              type="submit"
                              design=""
                              // disabled={!props.replyInput || props.commentLoading}
                            >
                              {/* send text in Talk */}
                              {t("groupTalk.text33", "Send text")} in Talk
                            </Button>
                          </Link>
                        </div>

                        {isCreator &&
                  props.groupInfo &&
                  props.groupInfo.creatorUserId !== member.userId && (
                    <div className={classes.buttonSmall}>
                      <Button mode="flat" type="submit"
                        onClick={() => {
                          setConfirmMemberDelete(!confirmMemberDelete);
                        }}
                      >
                        {/* Delete Member as Creator */}
                        {t("groupTalk.text34", "Delete Member as Creator")}
                      </Button>
                      {confirmMemberDelete && (
                        <div>
                          <div className={classes.confirmMessage}>
                            {/* Do you want to delete this member as creator? */}
                            {t("groupTalk.text35", "Do you want to delete this member as creator?")}
                          </div>
                          <div className={classes.buttonsContainer}>
                            <Button mode="flat" type="submit"
                              disabled={props.isLoading}
                              onClick={() => {
                                setConfirmMemberDelete(false);
                              }}
                            >
                              {/* Cancel */}
                              {t("general.text1", "Cancel")}
                            </Button>
                            <Button mode="raised" type="submit"
                              disabled={props.isLoading}
                              onClick={() => {
                                props.deleteGroupMemberHandler(
                                  props.groupInfo.groupRoomId,
                                  member.userId
                                );
                              }}
                            >
                              {/* Delete */}
                              {t("general.text3", "Delete")}
                            </Button>
                          </div>

                          {props.isLoading && <div><Loader /></div>}
                    
                          <div className={classes.resultMessage}>
                            {props.deleteMemberResult}
                          </div>
                          
                        </div>
                      )}
                    </div>
                  )}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

              </div>
            );
          })}
        </ul>
      </div>
    );
  }

  let groupMemberBody;

  groupMemberBody = (
    <div className="groupTalkTextList-groupNameContainer">
      <div className="groupTalkTextList-groupName">
        {props.groupInfo.groupName}
      </div>
      
      {!props.isLoading && 
        <div
          className="groupTalkTextList-showMemberButton"
          onClick={() => {
            showAllMembersHandler();
            showSmallModalHandler();
          }}
        >
          {/* Display Group Members &#9662; */}
          {t("groupTalk.text19", "Display Group Members")} &#9662;
        </div>
      }

      {showSmallModal && (
        <GroupInfoModal
          showModalHandler={showSmallModalHandler}
          modalContent={allMembers}
        />
      )}
    </div>
  );

  if (props.isLoading) {
    // groupMemberBody = null;
  }

  return (
    <div>
      <div id="group-info" className="groupTalkTextList-groupInfo">
        {groupMemberBody}
      </div>
    </div>
  );
};

export default GroupInfoMemberList;
