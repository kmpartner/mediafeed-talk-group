import React from 'react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import SmallModal from '../../Modal/SmallModal';
import TransBackdrop from '../../Backdrop/TransBackdrop';

import { deleteFiles } from '../../../util/group/group-upload';

import { SOCKET_GROUP_URL } from '../../../App';

import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './GroupTalkTextModal.module.css';

const GroupTalkTextModal = (props) => {
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

  const [isFileDeleting, setIsFileDeleting] = useState(false);

  const cancelClickHandler = () => {
    onCancel();
  }

  const confirmClickHandler = async () => {
    try {
      if (modalName === 'delete-text') {
  
        if (inputData.filePaths && inputData.filePaths.length > 0) {
          setIsFileDeleting(true);
          
          const deleteResult = await deleteFiles(
            SOCKET_GROUP_URL,
            localStorage.getItem('token'),
            inputData,
            inputData.filePaths,
          );
  
          setIsFileDeleting(false);
        }
  
        onConfirm(groupRoomId, groupTalkTextId, fromUserId);
      }

    } catch(err) {
      console.log(err);
      setIsFileDeleting(false);
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
            disabled={isLoading || isFileDeleting}
            loading={isLoading}
            onClick={cancelClickHandler}
          >
            {t('general.text1', 'Cancel')}
          </Button>
          <Button mode="raised" design="" type="submit" 
            disabled={isLoading || isFileDeleting}
            loading={isLoading}
            onClick={confirmClickHandler}
          >
            Accept
          </Button>
          {(isFileDeleting || isLoading) && (
            <Loader />
          )}
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

export default GroupTalkTextModal;