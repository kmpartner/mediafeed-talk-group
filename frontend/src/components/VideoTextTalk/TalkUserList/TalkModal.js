import React from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';

// import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './TalkModal.module.css';

const TalkModal = (props) => {
  // console.log('EditGroupModal.js props', props);

  const { 
    showModalHandler,
    modalContent,
  } = props;

  const [t] = useTranslation('translation');


  const confirmModalBody = (
    <div>
      <TransBackdrop onClick={showModalHandler} />
      <SmallModal style={classes.confirmModal}>
        <div className={classes.closeModalButtonContainer}
>
          <div></div>
          <div className={classes.closeModalButton}
            onClick={showModalHandler}
          >
            x
          </div>
        </div>
        {props.children}
        {/* {modalContent} */}
      </SmallModal>
    </div>
  );



  return (
    <Fragment>
      {confirmModalBody}
    </Fragment>
  )

}

export default TalkModal;