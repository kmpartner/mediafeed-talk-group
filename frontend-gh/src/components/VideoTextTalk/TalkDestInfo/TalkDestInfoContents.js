import React, { Fragment } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Button from "../../Button/Button";
import Loader from "../../Loader/Loader";
// import '../../../pages/VideoTextTalk/VideoTextTalk.css'
import classes from "./TalkDestInfoContents.module.css";

import SampleImage from "../../Image/person-icon-50.jpg";

const TalkDestInfoContents = (props) => {
  console.log("TalkDestInfoContents.js props", props);
  const {
    userId,
    noconnectDestUserId,
    usersData,
    favoriteUsers,
    editFavoriteUsersHandler,
    editFavoriteUsersResult,
    isLoading,
  } = props;

  const [t] = useTranslation("translation");

  const DestUserInfo = usersData.find((user) => {
    return user.userId === noconnectDestUserId;
  });

  const addToFavoriteHandler = () => {
    const addedList = favoriteUsers.concat({
      userId: noconnectDestUserId,
      addAt: Date.now(),
    });
    editFavoriteUsersHandler(userId, addedList);
  };

  const deleteFromFavoriteHandler = () => {
    const deletedList = favoriteUsers.filter((favorite) => {
      return favorite.userId !== noconnectDestUserId;
    });
    editFavoriteUsersHandler(userId, deletedList);
  };

  const isInFavorite = favoriteUsers.find((favorite) => {
    return favorite.userId === noconnectDestUserId;
  });
  // console.log(isInFavorite);

  const lsNameDataList = localStorage.getItem('lsNameDataList');

  let nameData;
  if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
    nameData = JSON.parse(lsNameDataList).find(ele => {
      return ele.userId === noconnectDestUserId;
    });
  }

  let destInfoContentsBody;

  destInfoContentsBody = (
    <div>
      <div>
        {/* Talking User Name: */}
        {t('videoTalk.text18', 'Talking User Name')}:
      </div>
      <div className={classes.userInfoContainer}>
        <span className={classes.userInfoContent}>
          {/* {DestUserInfo.name} */}
          {localStorage.getItem('userId') && nameData && (
            <span> 
              {nameData.name}
            </span>
          )}
        </span>
        {/* <Img
          className={classes.userImageElement}
          style={!DestUserInfo.imageUrl ? { paddingTop: "0.25rem" } : null}
          src={
            DestUserInfo.imageUrl
              ? // BASE_URL + '/' + element.imageUrl
                DestUserInfo.imageUrl
              : SampleImage
          }
          alt="user-img"
        /> */}
        {localStorage.getItem('userId') && nameData?.imageUrl && (
          <Img className={classes.userImageElement}
            // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
            src={nameData.imageUrl} 
          />
        )}
        {localStorage.getItem('userId') && !nameData?.imageUrl && (
          <Img className={classes.userImageElement}
            // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
            src={SampleImage} 
          />
        )}
      </div>

      {isInFavorite ? (
        <div className={classes.buttonSmall}>
          <Button
            mode="raised"
            type="submit"
            onClick={deleteFromFavoriteHandler}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {/* Delete from Favorite */}
            {t('groupTalk.text31', 'Delete from Favorite')}
          </Button>
        </div>
      ) : (
        <div className={classes.buttonSmall}>
          <Button
            mode="raised"
            type="submit"
            onClick={addToFavoriteHandler}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {/* Add to Favorite */}
            {t('groupTalk.text38', 'Add to Favorite')}
          </Button>
        </div>
      )}

      <div>{isLoading && <Loader />}</div>
      <div className={classes.editResult}>{editFavoriteUsersResult}</div>
    </div>
  );

  return <Fragment>{destInfoContentsBody}</Fragment>;
};

export default TalkDestInfoContents;
