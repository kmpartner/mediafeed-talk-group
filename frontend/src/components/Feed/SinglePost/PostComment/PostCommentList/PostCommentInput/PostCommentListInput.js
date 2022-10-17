import React, { Fragment, useState } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';

import Input from '../../../../../Form/Input/Input';
import InputEmoji from '../../../../../Form/Input/InputEmoji';
import Button from '../../../../../Button/Button';
// import './PostComment.css';

const PostCommentListInput = props => {
  // console.log('postCommentListInput-props', props);

  const [t] = useTranslation('translation');


  let InputElement;
    InputElement = (
      <div className="comment__actions">
      {/* <Input
        type="text"
        placeholder="comment...."
        control="input"
        onChange={props.commentInputChangeHandler}
        value={props.commentInput}
      /> */}

      {/* <InputEmoji
        type="text"
        label=""
        // placeholder="New Name..."
        // placeholder={t('userInfo.text6')}
        control="input"
        getInput={props.getInputHandler}
        onChange={props.commentInputChangeHandler}
        value={props.commentInput}
      /> */}
      <InputEmoji
        type="text"
        label=""
        placeholder="comment...."
        // placeholder={t('userInfo.text6')}
        control="textarea"
        getInput={props.getInputHandler}
        onChange={props.commentInputChangeHandler}
        value={props.commentInput}
        rows="3"
      />

      <Button
        mode="raised" type="submit"
        disabled={!props.commentInput || props.commentLoading}
        onClick={() => {
          props.setSelectedCommentId(null);
          props.commentPostHandler(props.commentInput, null);
          // setCommentInput('');
        }}
      >
        {/* Post comment */}
        {t('comment.text3')}
      </Button>
    </div>
    );





 





  return (
    <div>{InputElement}</div>
  )
};

export default PostCommentListInput;
