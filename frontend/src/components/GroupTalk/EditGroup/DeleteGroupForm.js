import React from 'react';
import { Fragment, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next/hooks';

import Button from '../../Button/Button';
import EditGroupModal from './EditGroupModal';
import Loader from '../../Loader/Loader';

import '../../../pages/GroupTalk/GroupTalk.css';

const DeleteGroup = (props) => {
  // console.log('grouplistItem.js props', props);

  const { 
    group,

    usersData,
    userId,
    deleteGroupHandler,
    deleteGroupResult,
    isLoading,

    showDeleteModal,
    showDeleteModalHandler,

    // creatorInfo,
    // displayTime,
  } = props;

  const [t] = useTranslation('translation');

  const [deleteCheck, setDeleteCheck] = useState(false);

  // console.log(deleteCheck);



    const deleteGroupModalBody = (
      <div>
        <div>Delete Group?</div>

        <input type="checkbox" id="delete-check"
          onChange={() => {setDeleteCheck(!deleteCheck)}}
        />
        <label htmlFor="delete-check">
          {/* I accept that all data are deleted. */}
          {t('groupTalk.text39', 'I accept that all data are deleted.')}
        </label>

        <div className="groupList-listElement">
          <Button mode="flat" design="" type="submit" 
            onClick={showDeleteModalHandler}
            // disabled={!deleteCheck}
            loading={isLoading}
          >
            {t('general.text1', 'Cancel')}
          </Button>
          <Button mode="raised" design="" type="submit" 
            onClick={() => {
              deleteGroupHandler(group.groupRoomId, userId);
            }}
            disabled={!deleteCheck}
            loading={isLoading}
          >
            {/* Delete */}
            {t('general.text3', 'Delete')}
          </Button>
        </div>

        {isLoading && <Loader />}

        <div className="groupTalk__createResult">
          {deleteGroupResult}
        </div>
      </div>
    );

  return (
      <Fragment>
        {showDeleteModal && 
          <EditGroupModal
            showConfirmModalHandler={showDeleteModalHandler}
            confirmModalContent={deleteGroupModalBody}
          />
        }

        </Fragment>
  );
}

export default DeleteGroup;