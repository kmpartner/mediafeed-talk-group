import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../Button/Button';
import Input from '../../Form/Input/Input';
import Loader from '../../Loader/Loader';
import EditGroupModal from './EditGroupModal';

import '../../../pages/GroupTalk/GroupTalk.css';
import classes from './EditGroupForm.module.css'

const EditGroup = (props) => {
  console.log('EditGroup.js props', props);

  const { 
    userId,
    selectedGroupForEdit,
    createGroupReslut,
    hideGroupCreationHandler,
    getGroupListHandler,
    upgradeGroupHandler,
    isLoading,
  } = props;

  const [t] = useTranslation('translation');

  const [groupNameInput, setGroupNameInput] = useState(selectedGroupForEdit.groupName);
  const [groupDescriptionInput, setGroupDescriptionInput] = useState(selectedGroupForEdit.description);
  const [showGroupCreationConfirm, setShowGroupCreationConfirm] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordList, setKeywordList] = useState(selectedGroupForEdit.keywords);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResult, setShowResult] = useState(false);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const groupNameInputHandler = (input, value) => {
    setGroupNameInput(value);
    setShowGroupCreationConfirm(false);
    // setCreateGroupReslut('');
    // console.log(groupNameInput);
  };

  const groupDescriptionInputHandler = (input, value) => {
    setGroupDescriptionInput(value);
    setShowGroupCreationConfirm(false);
    // setCreateGroupReslut('');
  }

  const showGroupCreationConfirmHandler = () => {
    setShowGroupCreationConfirm(!showGroupCreationConfirm);
  }

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


  const confirmModalContent = (
    <div>
      <div className="groupTalk__confirmCreateTitle">
        {/* Confirm your input */}
        {t('groupTalk.text12')}
      </div>
      <div className="groupTalk__confirmCreateInput">
        {/* Group Name: {groupNameInput} */}
        {t('groupTalk.text10')} : {groupNameInput}
      </div>
      <div className="groupTalk__confirmCreateInput">
        {/* Description: {groupDescriptionInput} */}
        {t('groupTalk.text2')}: {groupDescriptionInput}
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
      

      <div className="groupTalk__confirmCreateInput">
        <Button mode="raised" design="" type="submit"
          onClick={() => { 
            upgradeGroupHandler(
              userId, 
              selectedGroupForEdit.groupName,
              groupNameInput, 
              groupDescriptionInput,
              keywordList,
              selectedGroupForEdit.groupRoomId,
            );

            setShowResult(true);
          }}
          disabled={!groupNameInput.trim()}
          loading={isLoading}
        >
          {/* Update Group */}
          {t('groupTalk.text14')}
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

      <div>
        <div className="groupTalk__InputLabel">
          {/* Description */}
          {t('groupTalk.text2', 'Description')}
        </div>
        <Input
          type="text"
          // placeholder="group description (less than 500 characters)"
          placeholder={t('groupTalk.text18')}
          control="textarea"
          rows="3"
          onChange={groupDescriptionInputHandler}
          value={groupDescriptionInput}
        />
      </div>

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
            showGroupCreationConfirmHandler(); 
            showConfirmModalHandler();
          }}
          disabled={!groupNameInput.trim()}
        >
          {/* update group */}
          {t('groupTalk.text14')}
        </Button>
      </div> 

    </div>
  );

  return (
    <Fragment>

      {showConfirmModal && 
        <EditGroupModal
          showConfirmModalHandler={showConfirmModalHandler}
          confirmModalContent={confirmModalContent}
        />
      }

      {formBody}


      {/* {isLoading && <Loader />}
    
      <div className="groupTalk__createResult">
        {createGroupReslut}
      </div> */}
    </Fragment>
  );
}

export default EditGroup;