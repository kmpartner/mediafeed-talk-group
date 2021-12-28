import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Button from "../../Button/Button";
import Loader from "../../Loader/Loader";
import SampleImage from "../../Image/person-icon-50.jpg";

// import "../../../pages/GroupTalk/GroupTalk.css";
import classes from "./TalkUserListControllContents.module.css";

const TalkUserListControllContents = (props) => {
  console.log("TalkUserListControllContents.js-props", props);

  const {
    userId,
    usersData,
    favoriteUsers, 
    editFavoriteUsersHandler,
    editFavoriteUsersResult,
    noconnectGetUserDestTalkHandler,
    showNoconnectTextTalk,
    showNoconnectTextTalkHandler,
    noconnectDestUserIdHandler,
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

  const deleteFromFavoriteHandler = (deleteUserId) => {
    const deletedList = favoriteUsers.filter((favorite) => {
      return favorite.userId !== deleteUserId;
    });
    // console.log(deleteUserId, favoriteUsers, deletedList);
    editFavoriteUsersHandler(userId, deletedList);
  };

  // console.log(favoriteUsers);

  let favoriteListBody;

  if (favoriteUsers.length === 0) {
    favoriteListBody = (
    <div>
      {/* No Favorite Users. You can add in write text page. */}
    </div>
      );
  } else {
    favoriteListBody = (
      <ul>
        {favoriteUsers.map((favorite) => {
          const favoriteUserInfo = usersData.find(user => {
            return user.userId === favorite.userId;
          });
          console.log(favoriteUserInfo);

          return (
            <div key={favorite.userId}>
              <div className={classes.userInfoContainer}>
                <span className={classes.userInfoContent}>
                  {favoriteUserInfo.name}
                </span>
                <span className={classes.userImageContainer}>
                  {/* <img className="textTalk__UserImageElement" style={!element.imageUrl ? { paddingTop:"0.5rem" } : null} 
                        src={element.imageUrl ? 
                          // BASE_URL + '/' + element.imageUrl
                          element.imageUrl
                          : SampleImage
                          }
                        alt='user-img'
                      ></img> */}
                  <Img
                    className={classes.userImageElement}
                    style={!favoriteUserInfo.imageUrl ? { paddingTop: "0.25rem" } : null}
                    src={
                      favoriteUserInfo.imageUrl
                        ? // BASE_URL + '/' + element.imageUrl
                          favoriteUserInfo.imageUrl
                        : SampleImage
                    }
                    alt="user-img"
                  />
                </span>
              </div>

              <div className={classes.smallButtons} >
                {/* <Button mode="raised" design="" type="submit"
                  onClick={() => {
                      showGroupTalkTextHandler(favorite.groupRoomId);
                      getGroupInfoHandler(favorite.groupRoomId);
                  }}
                  disabled={showDeleteConfirm}
                  loading={isLoading}
                >
                    Group Page
                  </Button> */}
 
                <Button design='raised' mode='' size='smaller' 
                  onClick={() => {
                    // props.noconnectGetUserDestTalkHandler(element._id);
                    // props.showNoconnectTextTalkHandler();
                    // props.noconnectDestUserIdHandler(element._id);

                    noconnectGetUserDestTalkHandler(favorite.userId);
                    showNoconnectTextTalkHandler();
                    noconnectDestUserIdHandler(favorite.userId);
                  }}
                >
                  {/* write text */}
                  {t('groupTalk.text37', 'write text')}
                </Button>
 
                  <Button mode="flat" design="" type="submit" size='smaller'
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setSelectedDeleteId(favorite.userId);
                    }}
                    disabled={showDeleteConfirm}
                    loading={isLoading}
                  >
                    {/* delete from favorite */}
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

              

              {showDeleteConfirm && selectedDeleteId === favorite.userId && (
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
                      deleteFromFavoriteHandler(favoriteUserInfo.userId);
                      setShowDeleteConfirm(false);
                    }}
                    disabled=""
                    loading={isLoading}
                  >
                    {/* delete */}
                    {t('general.text3', 'Delete')}
                  </Button>
                </div>
              )}

              {selectedDeleteId === favorite.userId && 
                (
                  <div>
                    <div>{isLoading && <Loader />}</div>
                    <div className={classes.editResult}>
                      {editFavoriteUsersResult}
                      </div>
                  </div>
                )
              }

            </div>
          );
        })}
      </ul>
    );
  }

  const talkUserListControllContentsBody = (
    <div>
      <div
        // onCliclk={showFavoriteListHandler}
        onClick={() => {
          setShowFavoriteList(!showFavoriteList);
        }}
      >
        {/* Your Favorite Users &#9662; */}
        {t('videoTalk.text17', 'Your Favorite Users')} &#9662;
      </div>
      
      {showFavoriteList && favoriteListBody}

    </div>
  );

  return <Fragment>{talkUserListControllContentsBody}</Fragment>;
};

export default TalkUserListControllContents;
