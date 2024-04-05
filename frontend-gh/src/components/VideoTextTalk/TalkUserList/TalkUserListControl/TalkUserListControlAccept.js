import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Button from "../../../Button/Button";
import Loader from "../../../Loader/Loader";
import SampleImage from "../../../Image/person-icon-50.jpg";

import { 
  deleteAcceptUserId,
} from '../../../../util/talk/talk-permission';

import { useStore } from "../../../../hook-store/store";

import { BASE_URL } from '../../../../App';

import classes from "./TalkUserListControlContents.module.css";

const TalkUserListControlAccept = (props) => {
  // console.log("TalkUserListControllAccept.js-props", props);

  const {
    // userId,
    usersData,
    // favoriteUsers, 
    // editFavoriteUsersHandler,
    // editFavoriteUsersResult,
    noconnectGetUserDestTalkHandler,
    // showNoconnectTextTalk,
    showNoconnectTextTalkHandler,
    noconnectDestUserIdHandler,
    isLoading,
  } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  const talkPermission = store.talkPermission;
  // const talkAcceptUserIds = talkPermission.talkAcceptUserIds;
  
  // const [showFavoriteList, setShowFavoriteList] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState("");

  const [showAcceptList, setShowAcceptList] = useState(false);

  const [acceptLoading, setAcceptLoading] = useState(false);


  const deleteAcceptUserIdHandler = async (url, token, deleteUserId) => {
    try {
      setAcceptLoading(true);

      const result = await deleteAcceptUserId(url, token, deleteUserId);
      
      console.log(result);

      if (result.data) {
        dispatch('SET_TALKPERMISSION', result.data);
      }

      setAcceptLoading(false);

      dispatch('SHOW_NOTIFICATION', {
        // status: 'pending',
        //   title: '',
        message: 'deleted',
      });

      setTimeout(() => {
        dispatch('CLEAR_NOTIFICATION');
      },1000*5);

    } catch(err) {
      console.log(err);

      dispatch('SHOW_NOTIFICATION', {
        title: 'deletion failed',
      });

      setAcceptLoading(false);
    }
  };

  let acceptListBody = <div>{t('videoTalk.text25', 'no user')}</div>

  if (talkPermission && talkPermission.talkAcceptUserIds.length > 0) {
    const lsNameDataList = localStorage.getItem('lsNameDataList');

    acceptListBody = (
      <ul>
        {talkPermission.talkAcceptUserIds.map((favorite) => {
          const favoriteUserInfo = usersData.find(user => {
            return user.userId === favorite.userId;
          });
          // console.log(favoriteUserInfo);

          const isAccepted = talkPermission.talkAcceptedUserIds.find(user => {
            return user.userId === favorite.userId;
          });
        
          // console.log(isAccepted);
          let nameData;
          if (lsNameDataList && JSON.parse(lsNameDataList).length > 0) {
            nameData = JSON.parse(lsNameDataList).find(ele => {
              return ele.userId === favorite.userId;
            });
          }

          return (
            <div key={favorite.userId}>
              <div className={classes.userInfoContainer}>
                <span className={classes.userInfoContent}>
                  {/* {favoriteUserInfo.name} */}
                  {localStorage.getItem('userId') && nameData && (
                    <span> 
                      {nameData.name}
                    </span>
                  )}
                </span>
                {/* <Img
                  className={classes.userImageElement}
                  // style={!favoriteUserInfo.imageUrl ? { paddingTop: "0.25rem" } : null}
                  src={
                    favoriteUserInfo.imageUrl
                      ? // BASE_URL + '/' + element.imageUrl
                        favoriteUserInfo.imageUrl
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

              <div className={classes.smallButtons} >
                {isAccepted && (
                  <Button design='raised' mode='' size='smaller'
                    disabled={isLoading || acceptLoading} 
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
                )}
                {!isAccepted && (
                  <Button design='raised' mode='' size='smaller' 
                    disabled={true}
                  >
                    {t('videoTalk.text26', 'not accepted')}
                  </Button>
                )}
 
                  <Button mode="flat" design="raised" type="submit" size='smaller'
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setSelectedDeleteId(favorite.userId);
                    }}
                    // disabled={showDeleteConfirm}
                    disabled={showDeleteConfirm || isLoading || acceptLoading}
                    loading={isLoading}
                  >
                    {t('videoTalk.text24', 'Delete from accept list')}
                  </Button>
                </div>

              {showDeleteConfirm && selectedDeleteId === favorite.userId && (
                <div className={classes.buttonSmall} >
                  <Button mode="flat" design="" type="submit" size='smaller'
                    onClick={() => {
                      setShowDeleteConfirm(false);
                    }}
                    disabled={isLoading || acceptLoading}
                    loading={isLoading}
                  >
                    {t('general.text1', 'Cancel')}
                  </Button>
                  <Button mode="raised" design="" type="submit" size='smaller'
                    onClick={() => {
                      console.log('delete-clicked')
                      deleteAcceptUserIdHandler(
                        BASE_URL,
                        localStorage.getItem('token'),
                        favorite.userId,
                      );
                    }}
                    disabled={isLoading || acceptLoading}
                    loading={isLoading}
                  >
                    {t('general.text3', 'Delete')}
                  </Button>
                </div>
              )}

              {/* {selectedDeleteId === favorite.userId && 
                (
                  <div>
                    <div>{isLoading && <Loader />}</div>
                    <div className={classes.editResult}>
                      {editFavoriteUsersResult}
                      </div>
                  </div>
                )
              } */}

            </div>
          );
        })}
      </ul>
    )
  }

  const talkUserListControllAcceptBody = (
    <div>
      <div className={classes.controlAcceptBody}>
        <span
          onClick={() => {
            setShowAcceptList(!showAcceptList);
          }}
        >
          {/* Your accept user List &#9662; */}
          {t('videoTalk.text21', 'Your accept user List')} &#9662;
        </span>
      </div>
      
      {showAcceptList && acceptListBody}

    </div>
  );

  return <Fragment>{talkUserListControllAcceptBody}</Fragment>;
};

export default TalkUserListControlAccept;
