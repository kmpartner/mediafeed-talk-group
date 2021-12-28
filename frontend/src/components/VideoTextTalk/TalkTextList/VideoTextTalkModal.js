import React from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../Button/Button';
import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';

import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './VideoTextTalkModal.module.css';

const VideoTextTalkModal = (props) => {
  // console.log('GroupTalkTextModal.js props', props);

  const { 
    showModalHandler,
    modalContent,
    modalName,
    modalTitle,
    onCancel,
    onConfirm,
    groupRoomId,
    groupTalkTextId,
    fromUserId,
    inputData,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const cancelClickHandler = () => {
    onCancel();
  }

  const confirmClickHandler = () => {
    if (modalName === 'delete-text') {
      onConfirm(inputData, inputData.toUserId);
    }
  }

  const confirmModalBody = (
    <div>
      <TransBackdrop onClick={showModalHandler} />
      <SmallModal style={classes.confirmModal}>
        <div className="groupTalk__closeModalButtonContainer">
          <div></div>
          <div className="groupTalk__closeModalButton"
            onClick={showModalHandler}
          >
            X
          </div>
        </div>
        {modalContent}
        <div>{modalTitle}</div>
        {/* <div>group-talk-text-modal</div> */}
        <div className="groupTalkTextList-joinModalElement groupTalk__buttonSmall">
          <Button mode="flat" design="" type="submit" 
            disabled={isLoading}
            loading={isLoading}
            onClick={cancelClickHandler}
          >
            {t('general.text1', 'Cancel')}
          </Button>
          <Button mode="raised" design="" type="submit" 
            disabled={isLoading}
            loading={isLoading}
            onClick={confirmClickHandler}
          >
            Accept
          </Button>
        </div>
      </SmallModal>
    </div>
  );



  return (
    <Fragment>
      {confirmModalBody}
    </Fragment>
  )

}

export default VideoTextTalkModal;