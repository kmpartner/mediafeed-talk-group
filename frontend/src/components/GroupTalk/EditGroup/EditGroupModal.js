import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';

import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './EditGroupModal.module.css';

const EditGroupModal = (props) => {
  // console.log('EditGroupModal.js props', props);

  const { 
    showConfirmModalHandler,
    confirmModalContent,
  } = props;

  const [t] = useTranslation('translation');


  const confirmModalBody = (
    <div>
      <TransBackdrop onClick={showConfirmModalHandler} />
      <SmallModal style={classes.confirmModal}>
        <div className="groupTalk__closeModalButtonContainer">
          <div></div>
          <div className="groupTalk__closeModalButton"
            onClick={showConfirmModalHandler}
          >
            x
          </div>
        </div>
        {confirmModalContent}
      </SmallModal>
    </div>
  );



  return (
    <Fragment>
      {confirmModalBody}
    </Fragment>
  )

}

export default EditGroupModal;