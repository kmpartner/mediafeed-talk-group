import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import { useStore } from "../../hook-store/store";

import "./PageDescription.css";

const PageDescription = (props) => {
  // console.log('need-to-login-props', props);
  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();

  // console.log('store in NotPageFound.js', store);

  useEffect(() => {}, []);

  const pageDescriptionBody = (
    <div className="pageDescription">
      <div className="pageDescriptionContent">
        <div>
          <strong>Media Post Feed</strong>
        </div>
        <p>
          In media post feed, you can upload and share photos and videos.
          {' '}
          Writing comments on photos or videos enables to communicate and interact with other users.
        </p>
      </div>
      <div className="pageDescriptionContent">
        <div>
          <strong>Group Talk</strong>
        </div>
        <p>
          In group talk page, you can interact with many users with common interest.
          {' '}
          It is possible to create groups of your favorite topics.
          {' '}
          You can communicate and share ideas in group talk page.
        </p>
      </div>
      <div className="pageDescriptionContent">
        <div>
          <strong>Talk</strong>
          </div>
        <p>
          In Talk page, you can communicate with specified users one to one.
          {' '}
          Talk page is suitable for sending text messages and text chatting.
        </p>
      </div>
    </div>
  );

  return (
    <Fragment>
      <div>{pageDescriptionBody}</div>
    </Fragment>
  );
};

export default PageDescription;
