import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";

// import Loader from '../../components/Loader/Loader';
import TalkDestInfoContents from "./TalkDestInfoContents";
import TalkModal from "../TalkUserList/TalkModal";

import classes from "./TalkDestInfo.module.css";

const TalkDestInfo = (props) => {
  // console.log("TalkDestInfo.js props", props);
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

  const [showTalkInfoModal, setShowTalkInfoModal] = useState(false);


  const showTalkInfoModalHandler = () => {
    setShowTalkInfoModal(!showTalkInfoModal);
  };

  const groupInfoContents = (
    <TalkDestInfoContents
      userId={userId}
      noconnectDestUserId={noconnectDestUserId}
      usersData={usersData}
      favoriteUsers={favoriteUsers}
      editFavoriteUsersHandler={editFavoriteUsersHandler}
      editFavoriteUsersResult={editFavoriteUsersResult}
      isLoading={isLoading}
    />
  );

  let infoButtonBody;

  const infoButton = (
    <div className={classes.infoButton} onClick={showTalkInfoModalHandler}>
      &#8942;
    </div>
  );

  infoButtonBody = (
    <div>
      {!isLoading && infoButton}

      {showTalkInfoModal && (
        <TalkModal showModalHandler={showTalkInfoModalHandler}>
          {groupInfoContents}
        </TalkModal>
      )}
    </div>
  );

  return <Fragment>{infoButtonBody}</Fragment>;
};

export default TalkDestInfo;
