import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../Button/Button';
import Input from '../../Form/Input/Input';
import Loader from '../../Loader/Loader';
import EditGroupModal from './EditGroupModal';

import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './CreateGroupForm.module.css';

const CreateGroup = (props) => {
  // console.log('CreateGroup.js props', props);

  const { 
    createGroupHandler, 
    userId, 
    createGroupReslut,
    hideGroupCreationHandler,
    getGroupListHandler,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [groupNameInput, setGroupNameInput] = useState('');
  // const [showGroupCreationConfirm, setShowGroupCreationConfirm] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordList, setKeywordList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const groupNameInputHandler = (input, value) => {
    setGroupNameInput(value);
    // setShowGroupCreationConfirm(false);
    // console.log(groupNameInput);
  };

  const keywordInputHandler = (input, value) => {
    setKeywordInput(value);
  };

  const keywordAddHandler = (input) => {
    const addedList = keywordList.concat(input);
    setKeywordList(addedList);
  };

  const keywordDeleteHandler = (input) => {
    const deletedList = keywordList.filter(word => word !== input);
    setKeywordList(deletedList);
  };

  const showConfirmModalHandler = () => {
    if (!showConfirmModal) {
      setShowResult(false);
    }

    setShowConfirmModal(!showConfirmModal);

  }



  let confirmModalContent;
  confirmModalContent = (
    <div>
      <div className="groupTalk__confirmCreateTitle">
        {/* Confirm your input */}
        {t('groupTalk.text12')}
      </div>
      <div className="groupTalk__confirmCreateInput">
        {/* Group Name: {groupNameInput} */}
        {t('groupTalk.text10')}: {groupNameInput}
      </div>

      <div>
        <div className="groupTalk__confirmCreateInput">
          {/* keywords: */}
          {t('groupTalk.text22', 'keywords')}:
        </div>

        <ul>{keywordList.map(word => {
          return (
            <div className={classes.confirmKewordListItem}>
              {word}
            </div>
              );
            })}
        </ul>
      </div>

      <div>
        <Button mode="raised" design="" type="submit"
          onClick={() => { 
            createGroupHandler(userId, groupNameInput, keywordList);
            setShowResult(true);
          }}
          disabled={!groupNameInput.trim()}
          loading={isLoading}
        >
          {/* Create Group */}
          {t('groupTalk.text13')}
        </Button>
      </div>

      {isLoading && <Loader />}
      
      <div className="groupTalk__createResult">
        {showResult && createGroupReslut}

      </div>
  </div>
);


  let formBody;
  formBody = (
    <div className={classes.editGroupFormContainer}>
      <div className="groupTalk__buttonSmall">
        <Button mode="raised" design="" type="submit"
          onClick={() => {
            hideGroupCreationHandler();
            getGroupListHandler();
          }}
        >
          {/* Back to List */}
          {t('groupTalk.text11')}
        </Button>
      </div>

      <div className="groupTalk__InputLabel">
        {/* Group Name */}
        {t('groupTalk.text10')}
      </div>
      <Input
        type="text"
        // placeholder="group name (5-100 characters)"
        placeholder={t('groupTalk.text17')}
        control="input"
        onChange={groupNameInputHandler}
        value={groupNameInput}
      />

      <div className="groupTalk__InputLabel">
        {/* keywords (contents, topics, etc...) */}
        {t('groupTalk.text22')}{' '}({t('groupTalk.text40', 'contents, topics, etc...')})
      </div>
      <Input
        type="text"
        // placeholder="maximum 5 keywords, less than 20 characters for each keyword"
        placeholder={t('groupTalk.text26', 'maximum 5 keywords, less than 20 characters for each keyword')}
        control="input"
        onChange={keywordInputHandler}
        value={keywordInput}
      />

      <div className="groupTalk__buttonSmall">
        <Button mode="raised" design="" type="submit"
          onClick={() => {
            keywordAddHandler(keywordInput);
            setKeywordInput('');
          }}
          disabled={!keywordInput.trim() || keywordInput.length >= 20 || keywordList.length >= 5}
        >
          {/* add keyword */}
          {t('groupTalk.text27', 'Add keyword')}
        </Button>
      </div>

      <ul>{keywordList.map(word => {
          return (
            <div className={classes.kewordListItem}>
              {word} <span onClick={() => keywordDeleteHandler(word)}>{'   '}({t('general.text3', 'Delete')})</span>
            </div>
          );
        })}
      </ul>

      <div>
        <Button mode="raised" design="" type="submit"
          onClick={() => {
            // showGroupCreationConfirmHandler(); 
            showConfirmModalHandler();
          }}
          disabled={!groupNameInput.trim()}
        >
          {/* create group */}
          {t('groupTalk.text13')}
        </Button>
      </div>

    </div>
  );


  return (
    <Fragment>
      {/* {confirmModalBody} */}

      {showConfirmModal && 
        <EditGroupModal
          showConfirmModalHandler={showConfirmModalHandler}
          confirmModalContent={confirmModalContent}
        />
      }

      {formBody}

    </Fragment>
  )

}

export default CreateGroup;