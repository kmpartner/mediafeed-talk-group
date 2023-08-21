import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next/hooks";

import ImageEditorLink from "./ImageEditorLink";
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
          <strong>
            {t("notFound.text5", "Media Post Feed")}
          </strong>
        </div>
        <p>
          {t("notFound.text6", "In media post feed, you can upload and share photos and videos.")}
          {' '}
          {t("notFound.text7", "Writing comments on photos or videos enables to communicate and interact with other users.")}
        </p>
        <p>
          <ImageEditorLink />
        </p>
      </div>
      <div className="pageDescriptionContent">
        <div>
          <strong>
            {t("notFound.text8", "Group Talk")}
            </strong>
        </div>
        <p>
          {t("notFound.text9", "In group talk page, you can interact with many users with common interest.")}
          {' '}
          {t("notFound.text10", "It is possible to create groups of your favorite topics.")}
          {' '}
          {t("notFound.text11", "You can communicate and share ideas in group talk page.")}
        </p>
      </div>
      <div className="pageDescriptionContent">
        <div>
          <strong>
            {t("notFound.text12", "Talk")}
          </strong>
          </div>
        <p>
          
          {t("notFound.text13", "In Talk page, you can communicate with specified users one to one.")}
          {' '}
          {t("notFound.text14", "Talk page is suitable for sending text messages and text chatting.")}
        </p>
      </div>
      <div className="pageDescriptionContent">
        <div>
          <strong>
            watakura your site
          </strong>
          </div>
        <p>
          <a 
            href={'https://wpsite.watakura.xyz'}
            rel="noopener noreferrer" target="_blank"
          >
            watakura your site
          </a>
          {' '}
          enables you to create your site or blog.
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
