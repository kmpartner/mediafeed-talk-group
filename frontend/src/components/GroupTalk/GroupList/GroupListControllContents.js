import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Button from "../../Button/Button";
import Loader from "../../Loader/Loader";
import SampleImage from "../../Image/person-icon-50.jpg";

import "../../../pages/GroupTalk/GroupTalk.css";
import classes from "./GroupListControllContents.module.css";

const GroupListControllContents = (props) => {
  // console.log("GroupListControllContents.js-props", props);

  const {
    groupList,
    groupUserInfo,
    showGroupTalkTextHandler,
    getGroupInfoHandler,
    editFavoriteGroupsHandler,
    editFavoriteGroupsResult,
    isLoading,
  } = props;

  const [t] = useTranslation("translation");

  const [showFavoriteList, setShowFavoriteList] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState("");

  // const showFavoriteListHandler = () => {
  //   setShowFavoriteList(!showFavoriteList);
  //   console.log(showFavoriteList);
  // };

  const deleteFromFavoriteHandler = (groupRoomId) => {
    const deletedList = groupUserInfo.favoriteGroups.filter((favorite) => {
      return favorite.groupRoomId !== groupRoomId;
    });
    editFavoriteGroupsHandler(groupUserInfo.userId, deletedList);
  };

  const favoriteList = [];
  for (const ele of groupUserInfo.favoriteGroups) {
    const foundInGroupList = groupList.find(
      (group) => group.groupRoomId === ele.groupRoomId
    );

    if (foundInGroupList) {
      favoriteList.push(foundInGroupList);
    }
  }
  // console.log(favoriteList);

  let favoriteListBody;

  if (favoriteList.length === 0) {
    favoriteListBody = (
    <div>
      {/* No Favorite Group exist. You can add in Group Page. */}
      {t('groupTalk.text29', 'No Favorite Group exist. You can add in Group Page.')}
    </div>
      );
  } else {
    favoriteListBody = (
      <ul>
        {favoriteList.map((favorite) => {
          return (
            <div key={favorite.groupRoomId}>
              {/* groupRoomId: {favorite.groupRoomId} */}
              {t('groupTalk.text10', 'Group Name')}: 
                <span className={classes.listElementContent}
                  // onClick={() => {
                  //   showGroupTalkTextHandler(favorite.groupRoomId);
                  //   getGroupInfoHandler(favorite.groupRoomId);
                  // }}
                >
                  {favorite.groupName}
                </span>

              <div className={classes.smallButtons} >
                <Button mode="raised" design="" type="submit"
                  onClick={() => {
                      showGroupTalkTextHandler(favorite.groupRoomId);
                      getGroupInfoHandler(favorite.groupRoomId);
                  }}
                  disabled={showDeleteConfirm}
                  loading={isLoading}
                >
                    {/* Group Page */}
                    Group {t('groupTalk.text30', 'Page')}
                  </Button>
                  <Button mode="flat" design="" type="submit" size='smaller'
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setSelectedDeleteId(favorite.groupRoomId);
                    }}
                    disabled={showDeleteConfirm}
                    loading={isLoading}
                  >
                    {/* Delete from favorite */}
                    {t('groupTalk.text31', 'Delete from favorite')}
                  </Button>
                </div>

                <div className={classes.buttonSmall} >
                  {/* <Button mode="flat" design="" type="submit"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setSelectedDeleteId(favorite.groupRoomId);
                    }}
                    disabled={showDeleteConfirm}
                    loading={isLoading}
                  >
                    delete from favorite
                  </Button> */}
                </div>

              

              {showDeleteConfirm && selectedDeleteId === favorite.groupRoomId && (
                <div className={classes.buttonSmall} >
                  <Button mode="flat" design="" type="submit" size='smaller'
                    onClick={() => {
                      setShowDeleteConfirm(false);
                    }}
                    disabled=""
                    loading={isLoading}
                  >
                    {/* Cancel */}
                    {t('general.text1', 'Cancel')}
                  </Button>
                  <Button mode="raised" design="" type="submit" size='smaller'
                    onClick={() => {
                      deleteFromFavoriteHandler(favorite.groupRoomId);
                      setShowDeleteConfirm(false);
                    }}
                    disabled=""
                    loading={isLoading}
                  >
                    {/* Delete */}
                    {t('general.text3', 'Delete')}
                  </Button>
                </div>
              )}

              {selectedDeleteId === favorite.groupRoomId && 
                (
                  <div>
                    <div>{isLoading && <Loader />}</div>
                    <div className="groupTalk__createResult">{editFavoriteGroupsResult}</div>
                  </div>
                )
              }

            </div>
          );
        })}
      </ul>
    );
  }

  const groupListControllContentsBody = (
    <div>
      <div
        // onCliclk={showFavoriteListHandler}
        onClick={() => {
          setShowFavoriteList(!showFavoriteList);
        }}
      >
        {/* Your Favorite Groups &#9662; */}
        {t('groupTalk.text28', 'Your Favorite Groups')} &#9662;
      </div>
      
      {showFavoriteList && favoriteListBody}

    </div>
  );

  return <Fragment>{groupListControllContentsBody}</Fragment>;
};

export default GroupListControllContents;
