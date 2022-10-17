import React, { useState, useEffect, Fragment } from "react";
// import { Link } from 'react-router-dom';
// import Select from 'react-select';
import { withI18n } from "react-i18next";

import SmallModal from "../../Modal/SmallModal";

import { BOOKLIVE_URL, LIVE_URL } from "../../../App";

import classes from "./StartNewLive.module.css";

function StartNewLive(props) {
  const { t, onClose } = props;

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
            {t('live.text01', 'By using video presentation app')}
            {' '}
            (<a className={classes.startNewLiveLink} 
                href={LIVE_URL + '/your-presentation'} target="_blank" rel="noopener noreferrer"
              >
                REMEET-WePL
              </a>
            ), {t('live.text02', 'you can start live broadcast in feed page.')}
          </p>
          <p>
            <a className={classes.startNewLiveLink} 
              href={LIVE_URL+ '/your-presentation'} target="_blank" rel="noopener noreferrer"
            >
              REMEET-WePL
            </a>
            {" "}
            {t('live.text03', 'is a simple video presentation app with text chat, screen share, file share.')}
          </p>
          <p>
            {t('live.text04', 'To start live broadcast, you need to reserve a room at')}
            {" "}
            <a className={classes.startNewLiveLink} 
              href={BOOKLIVE_URL} target="_blank" rel="noopener noreferrer"
            >
              {t('live.text05', 'room reservation page')}
            </a>
          </p>
        </div>
      </SmallModal>
    </Fragment>
  );
}

export default withI18n()(StartNewLive);
