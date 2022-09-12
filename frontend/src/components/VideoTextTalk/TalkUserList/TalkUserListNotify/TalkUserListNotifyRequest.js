import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";

import Button from "../../../Button/Button";
import Loader from "../../../Loader/Loader";
import SampleImage from "../../../Image/person-icon-50.jpg";

import { 
  deleteAcceptUserId,
  addRequestingUserId,
  addAcceptUserId,
} from '../../../../util/talk-permission';

import { useStore } from "../../../../hook-store/store";

import { BASE_URL } from '../../../../App';

import classes from "./TalkUserListNotifyRequest.module.css";

const TalkUserListNotifyRequest = (props) => {
  // console.log("TalkUserListControllAccept.js-props", props);

  const {
    // userId,
    usersData,
    // noconnectGetUserDestTalkHandler,
    // showNoconnectTextTalkHandler,
    // noconnectDestUserIdHandler,
    isLoading,
  } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  const talkPermission = store.talkPermission;

  // const [showFavoriteList, setShowFavoriteList] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState("");

  const [showAcceptList, setShowAcceptList] = useState(false);
  const [showRequestedList, setShowRequestedList] = useState(true);

  const [acceptLoading, setAcceptLoading] = useState(false);


  const addAcceptUserIdHandler = async (url, token, acceptUserId) => {
    try {
      setAcceptLoading(true);

      const result = await addAcceptUserId(url, token, acceptUserId);
      
      console.log(result);

      if (result.data) {
        dispatch('SET_TALKPERMISSION', result.data);
      }

      setAcceptLoading(false);

      dispatch('SHOW_NOTIFICATION', {
        // status: 'pending',
        //   title: '',
        message: 'accept success',
      });

      setTimeout(() => {
        dispatch('CLEAR_NOTIFICATION');
      },1000*5);

    } catch(err) {
      console.log(err);

      dispatch('SHOW_NOTIFICATION', {
        title: 'accept failed failed',
      });

      setAcceptLoading(false);
    }
  };

  let requestedBody = <div>{t('videoTalk.text25', 'no user')}</div>;

  if (talkPermission && talkPermission.talkRequestedUserIds.length > 0) {
    requestedBody = (
      <ul>
        {talkPermission.talkRequestedUserIds.map((favorite) => {
          const favoriteUserInfo = usersData.find(user => {
            return user.userId === favorite.userId;
          });
          // console.log(favoriteUserInfo);

          const isAccepted = talkPermission.talkAcceptedUserIds.find(user => {
            return user.userId === favorite.userId;
          });
        
          // console.log(isAccepted);

          return (
            <div key={favorite.userId}>
              <div className={classes.userInfoContainer}>
                <span className={classes.userInfoContent}>
                  {favoriteUserInfo.name}
                </span>
                <span className={classes.userImageContainer}>
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
                <Button design='raised' mode='' size='smaller'
                    disabled={isLoading || acceptLoading} 
                    onClick={() => {
                      addAcceptUserIdHandler(
                        BASE_URL,
                        localStorage.getItem('token'),
                        favorite.userId,
                      );
                    }}
                  >
                    {t('videoTalk.text20', 'Accept User')}
                </Button>
              </div>

              {/* <div className={classes.smallButtons} >
                {isAccepted && (
                  <Button design='raised' mode='' size='smaller'
                    disabled={isLoading || acceptLoading} 
                    onClick={() => {
                      noconnectGetUserDestTalkHandler(favorite.userId);
                      showNoconnectTextTalkHandler();
                      noconnectDestUserIdHandler(favorite.userId);
                    }}
                  >
                    {t('groupTalk.text37', 'write text')}
                  </Button>
                )}
                {!isAccepted && (
                  <Button design='raised' mode='' size='smaller' 
                    disabled={true}
                  >
                    not-accepted
                  </Button>
                )}
 
                  <Button mode="flat" design="" type="submit" size='smaller'
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setSelectedDeleteId(favorite.userId);
                    }}
                    // disabled={showDeleteConfirm}
                    disabled={showDeleteConfirm || isLoading || acceptLoading}
                    loading={isLoading}
                  >
                    delete-from-accept-user
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
                      // deleteAcceptUserIdHandler(
                      //   BASE_URL,
                      //   localStorage.getItem('token'),
                      //   favorite.userId,
                      // );
                    }}
                    disabled={isLoading || acceptLoading}
                    loading={isLoading}
                  >
                    {t('general.text3', 'Delete')}
                  </Button>
                </div>
              )} */}



            </div>
          );
        })}
      </ul>
    );
  }

  // let acceptListBody = <div>no user</div>

  // if (talkPermission && talkAcceptUserIds.length > 0) {
  //   acceptListBody = (
  //     <ul>
  //       {talkAcceptUserIds.map((favorite) => {
  //         const favoriteUserInfo = usersData.find(user => {
  //           return user.userId === favorite.userId;
  //         });
  //         // console.log(favoriteUserInfo);

  //         const isAccepted = talkPermission.talkAcceptedUserIds.find(user => {
  //           return user.userId === favorite.userId;
  //         });
        
  //         // console.log(isAccepted);

  //         return (
  //           <div key={favorite.userId}>
  //             <div className={classes.userInfoContainer}>
  //               <span className={classes.userInfoContent}>
  //                 {favoriteUserInfo.name}
  //               </span>
  //               <span className={classes.userImageContainer}>
  //                 <Img
  //                   className={classes.userImageElement}
  //                   style={!favoriteUserInfo.imageUrl ? { paddingTop: "0.25rem" } : null}
  //                   src={
  //                     favoriteUserInfo.imageUrl
  //                       ? // BASE_URL + '/' + element.imageUrl
  //                         favoriteUserInfo.imageUrl
  //                       : SampleImage
  //                   }
  //                   alt="user-img"
  //                 />
  //               </span>
  //             </div>

  //             <div className={classes.smallButtons} >
  //               {isAccepted && (
  //                 <Button design='raised' mode='' size='smaller'
  //                   disabled={isLoading || acceptLoading} 
  //                   onClick={() => {
  //                     // props.noconnectGetUserDestTalkHandler(element._id);
  //                     // props.showNoconnectTextTalkHandler();
  //                     // props.noconnectDestUserIdHandler(element._id);

  //                     noconnectGetUserDestTalkHandler(favorite.userId);
  //                     showNoconnectTextTalkHandler();
  //                     noconnectDestUserIdHandler(favorite.userId);
  //                   }}
  //                 >
  //                   {/* write text */}
  //                   {t('groupTalk.text37', 'write text')}
  //                 </Button>
  //               )}
  //               {!isAccepted && (
  //                 <Button design='raised' mode='' size='smaller' 
  //                   disabled={true}
  //                 >
  //                   not-accepted
  //                 </Button>
  //               )}
 
  //                 <Button mode="flat" design="" type="submit" size='smaller'
  //                   onClick={() => {
  //                     setShowDeleteConfirm(true);
  //                     setSelectedDeleteId(favorite.userId);
  //                   }}
  //                   // disabled={showDeleteConfirm}
  //                   disabled={showDeleteConfirm || isLoading || acceptLoading}
  //                   loading={isLoading}
  //                 >
  //                   delete-from-accept-user
  //                   {/* {t('groupTalk.text31', 'Delete from favorite')} */}
  //                 </Button>
  //               </div>

  //             {showDeleteConfirm && selectedDeleteId === favorite.userId && (
  //               <div className={classes.buttonSmall} >
  //                 <Button mode="flat" design="" type="submit" size='smaller'
  //                   onClick={() => {
  //                     setShowDeleteConfirm(false);
  //                   }}
  //                   disabled={isLoading || acceptLoading}
  //                   loading={isLoading}
  //                 >
  //                   {t('general.text1', 'Cancel')}
  //                 </Button>
  //                 <Button mode="raised" design="" type="submit" size='smaller'
  //                   onClick={() => {
  //                     console.log('delete-clicked')
  //                     // deleteAcceptUserIdHandler(
  //                     //   BASE_URL,
  //                     //   localStorage.getItem('token'),
  //                     //   favorite.userId,
  //                     // );
  //                   }}
  //                   disabled={isLoading || acceptLoading}
  //                   loading={isLoading}
  //                 >
  //                   {t('general.text3', 'Delete')}
  //                 </Button>
  //               </div>
  //             )}

  //             {/* {selectedDeleteId === favorite.userId && 
  //               (
  //                 <div>
  //                   <div>{isLoading && <Loader />}</div>
  //                   <div className={classes.editResult}>
  //                     {editFavoriteUsersResult}
  //                     </div>
  //                 </div>
  //               )
  //             } */}

  //           </div>
  //         );
  //       })}
  //     </ul>
  //   )
  // }

  const talkUserListNotifyRequestedBody = (
    <div>
      <div className={classes.controlAcceptBody}>
        <span
          onClick={() => {
            setShowRequestedList(!showRequestedList);
          }}
        >
          {/* Requested List &#9662; */}
          {t('videoTalk.text22', 'Requested List')} &#9662;
        </span>
      </div>
      
      {showRequestedList && requestedBody}

    </div>
  );

  return <Fragment>{talkUserListNotifyRequestedBody}</Fragment>;
};

export default TalkUserListNotifyRequest;
