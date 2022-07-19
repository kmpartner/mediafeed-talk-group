import React, { useState, useEffect, Fragment } from "react";
// import { Link } from 'react-router-dom';
// import Select from 'react-select';
import { withI18n } from "react-i18next";

import SmallModal from "../../Modal/SmallModal";

import { BOOKLIVE_URL, LIVE_URL } from "../../../App";

import classes from "./StartNewLive.module.css";

function StartNewLive(props) {
  const { onClose } = props;

  return (
    <Fragment>
      <SmallModal style={classes.startNewLiveModal}>
        <div className={classes.startNewLive}>
          <div className={classes.closeButtonContainer}>
            <strong className={classes.closeButton}
            onClick={onClose}
            >
              X
            </strong>
          </div>
          <div></div>

          <p>
            By using video presentation app (
            <a className={classes.startNewLiveLink} 
              href={LIVE_URL + '/your-new-presentation'} target="_blank" rel="noopener noreferrer"
            >
              REMEET-WePL
            </a>
            ), you can start live broadcasting in feed page.
          </p>
          <p>
            <a className={classes.startNewLiveLink} 
              href={LIVE_URL+ '/your-new-presentation'} target="_blank" rel="noopener noreferrer"
            >
              REMEET-WePL
            </a>{" "}
            is a simple video presentation app with text chat, screen share, file share.
          </p>
          <p>
            To start live broadcasting, you need to reserve a room at{" "}
            <a className={classes.startNewLiveLink} 
              href={BOOKLIVE_URL} target="_blank" rel="noopener noreferrer"
            >
              room reservation page
            </a>
          </p>
        </div>
      </SmallModal>
    </Fragment>
  );
}

export default withI18n()(StartNewLive);
