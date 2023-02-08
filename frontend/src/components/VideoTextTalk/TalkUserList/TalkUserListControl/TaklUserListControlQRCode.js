import React from "react";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";


// import Button from "../../../Button/Button";
import Loader from "../../../Loader/Loader";

// import TalkQRScan from "./TalkQRScan";

import { useStore } from "../../../../hook-store/store";
import { makeQrcode } from "../../../../util/image";

import { marks } from "../../../../images/marks";
// import SampleImage from "../../../Image/person-icon-50.jpg";

import { BASE_URL } from "../../../../App";

import classes from "./TaklUserListControlQRCode.module.css";

const TalkUserListControlQRCode = (props) => {
  // console.log("TalkUserListControllContents.js-props", props);

  const {
    // userId,
    // usersData,
    // favoriteUsers, 
    // editFavoriteUsersHandler,
    // editFavoriteUsersResult,
    // noconnectGetUserDestTalkHandler,
    // showNoconnectTextTalk,
    // showNoconnectTextTalkHandler,
    // noconnectDestUserIdHandler,
    // isLoading,
  } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // console.log('store-TalkUserListControlQRcode', store);
  const talkPermission = store.talkPermission;

  const [createdQR, setCreatedQR] = useState();
  const [showQRCode, setShowQRCode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // const [startScan, setStartScan] = useState(false);

  useEffect(() => {
    const makeQRHandler = async () => {
      try {
        setIsLoading(true);

        const tokenForQR = await getTokenForQR(BASE_URL, localStorage.getItem('token')); 

        console.log('tokenForQR', tokenForQR);

        // const generatedQR = await makeQrcode(JSON.stringify({
        //   userId: localStorage.getItem('userId'),
        //   token: localStorage.getItem('token'),
        // }));

        if (tokenForQR) {
          const generatedQR = await makeQrcode(JSON.stringify({
            token: tokenForQR.data,
            userId: localStorage.getItem('userId'),
          }));
          // const generatedQR = await makeQrcode(localStorage.getItem('token'));
  
          if (generatedQR) {
            setCreatedQR(generatedQR);
          }
        }

        setIsLoading(false);

      } catch(err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    if (showQRCode) {
      makeQRHandler();
    }

  },[showQRCode]);


  const getTokenForQR = async (url, token) => {
    try {
      const result = await fetch(url + '/talk-permission/token-for-qr', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
      });
  
      const resData = await result.json();

      console.log(result, resData);
      // dispatch('SET_TALKPERMISSION', resData.data);

      if (!result.ok) {
        throw new Error('error occured');
      }

      if (resData.data) {
        return resData;
      }
    } catch(err) {
      console.log(err);
      throw err;
    }
  };

  let talkUserListControlQRcodeBody;

  talkUserListControlQRcodeBody = (
    <div className={classes.talkUserListQR}>
      <div
        onClick={() => {
          setShowQRCode(!showQRCode);
        }}
      > 
        {t("videoTalk.text29", "Display QR Code")}
        {' '}
        {marks.qrcode}
        {' '}
        {marks.triangleDown}
      </div>
      {showQRCode && (
        <div>
          {t("videoTalk.text30", "User who scanned this QR code will be accepted to talk with you.")}
          <br/>
          {t("videoTalk.text31", "Let other users scan this QR code.")}
          <br/>
          {t("videoTalk.text32", "QR code scanner exist at this user list page in their device.")}
          <img 
            style={{height: "160px"}}
            src={createdQR}
          />
        </div>
      )}
    </div>
  )

  return <Fragment>
      {isLoading && <Loader />}
      {talkUserListControlQRcodeBody}
    </Fragment>;
};

export default TalkUserListControlQRCode;
