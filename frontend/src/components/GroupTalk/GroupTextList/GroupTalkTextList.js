import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";

import Loader from "../../Loader/Loader";
import GroupTalkTextItem from "./GroupTalkTextItem";
import { getRandomBgColor } from "../../../util/color-style";

const GroupTalkTextList = (props) => {
  console.log('GroupTalkTextList-props', props);

  const [t] = useTranslation("translation");

  // const [isGroupMember, setIsGroupMember] = useState(false);
  const [userColorList, setUserColorList] = useState([]);

  useEffect(() => {
    // var div = document.getElementById('text-talk');
    // console.log('div', div);
    scrollToBottom("text-talk");
  }, [props.groupTalkInputList.length]);

  useEffect(() => {
    if (props.groupAllMemberList.length > 0) {
      setUserColorList(generateRandomUserColorList(props.groupAllMemberList));
    }
  }, [props.groupAllMemberList]);



  useEffect(() => {
    const memberList = props.groupAllMemberList;
    let noMemberInterval;

    if (memberList && memberList.length > 0) {
      const isMember = memberList.find(member => {
        return member.userId === props.userId;
      });

      
      if (!isMember) {
        noMemberInterval = setInterval(() => {
          console.log('inside setInterval')
          // props.getGroupInfoHandler(props.groupTalkId);
        }, 1000 * 60 * 5);
      }

    }

    return () => {
      clearInterval(noMemberInterval);
    }
    

  },[props.groupAllMemberList]);



  const scrollToTop = (id) => {
    var div = document.getElementById(id);
    if (div) {
      div.scrollTop = 0;
    }
  };

  const scrollToBottom = (id) => {
    var div = document.getElementById(id);
    if (div) {
      div.scrollTop = div.scrollHeight - div.clientHeight;
    }
  };




  const lsUsersColorInfo = JSON.parse(localStorage.getItem("groupColorInfo"));

  if (!lsUsersColorInfo) {
    localStorage.setItem("groupColorInfo", JSON.stringify([{}]));
  }

  function generateRandomUserColorList(memberList) {

    const bgColorArray = [];
    // for (var i = number; i--;) {
    //   bgColorArray.push(getRandomBgColor());
    // }

    for (const member of memberList) {
      if (lsUsersColorInfo && lsUsersColorInfo.length > 0) {
        let addedList = lsUsersColorInfo;

        const lsUser = lsUsersColorInfo.find((element) => {
          return element.userId === member.userId;
        });
        // console.log("lsUser", lsUser);

        if (lsUser) {
          bgColorArray.push({
            userId: member.userId,
            bgColor: lsUser.bgColor,
          });
        } else {
          bgColorArray.push({
            userId: member.userId,
            bgColor: getRandomBgColor(),
          });

          addedList = lsUsersColorInfo.concat({
            userId: member.userId,
            bgColor: getRandomBgColor(),
          });

        }

        localStorage.setItem("groupColorInfo", JSON.stringify(addedList));
      }
    }


    return bgColorArray;
  }

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

  let textList;
  if (props.groupTalkInputList.length > 0) {
    textList = (
      <ul className="textTalk-list">
        {props.groupTalkInputList.map((inputData, index) => {
          return (
            <GroupTalkTextItem
              inputData={inputData}
              userId={props.userId}
              // index={index}
              userColorList={userColorList}
              groupAllMemberList={props.groupAllMemberList}
              groupTextReactions={props.groupTextReactions}
              createGroupTextReactionHandler={props.createGroupTextReactionHandler}
              groupTextDeleteHandler={props.groupTextDeleteHandler}
              isLoading={props.isLoading}
            />
          );
        })}
      </ul>
    );
  }

  return (
    <div>
      <div
        id="text-talk"
        className="groupTalkTextList-container"
        style={!props.showGroupTextInputElement ? { bottom: "10px" } : {}}
      >
        {props.isLoading && (
          <div className="groupTalk__loader">
            <Loader />
          </div>
        )}

        {textList}
      </div>
    </div>
  );
};

export default GroupTalkTextList;
