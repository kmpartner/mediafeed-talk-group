import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next/hooks";
// import Img from "react-cool-img";

// import Button from '../../Button/Button';
// import TalkUserListPermission from './TalkUserListPermission';

import { useStore } from "../../../hook-store/store";

import { marks } from "../../../images/marks";

import { BASE_URL } from "../../../App";
// import './VideoTextTalk.css'

import SampleImage from "../../Image/person-icon-50.jpg";
import { Fragment } from "react";

const TalkShare = (props) => {
  const {
    setConnectClick,
  } = props;
  // console.log('UserTalkList.js-props', props);

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const shareUserIdParam = queryParams.get('shareUserId');

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  // const [suggestInput, setSuggestInput] = useState('');

  useEffect(() => {
    if (setConnectClick && shareUserIdParam) {
      setConnectClick(true);
    }
  },[setConnectClick, shareUserIdParam]);
  return (
    <Fragment></Fragment>
  );
};

export default TalkShare;
