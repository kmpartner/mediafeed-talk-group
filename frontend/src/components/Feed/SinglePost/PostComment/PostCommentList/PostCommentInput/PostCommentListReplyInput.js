import React, { Fragment, useState } from 'react';
// import openSocket from 'socket.io-client';
import { useTranslation } from 'react-i18next/hooks';

import Input from '../../../../../Form/Input/Input';
import InputEmoji from '../../../../../Form/Input/InputEmoji';
import Button from '../../../../../Button/Button';
// import './PostComment.css';

const PostCommentListReplyInput = props => {
  // console.log('postCommentListReplyInput-props', props);

  const [t] = useTranslation('translation');


  let replyInputElement;
    replyInputElement = (
      <div className="comment__replyInput">
        {/* <Input
          type="text"
          placeholder="reply comment..."
          control="input"
          onChange={props.replyInputChangeHandler}
          value={props.replyInput}
        /> */}

      {/* <InputEmoji
        type="text"
        label=""
        // placeholder="New Name..."
        // placeholder={t('userInfo.text6')}
        control="input"
        getInput={props.getReplyInputHandler}
        onChange={props.replyInputChangeHandler}
        value={props.replyInput}
      /> */}
      <InputEmoji
        type="text"
        label=""
        placeholder="reply..."
        // placeholder={t('userInfo.text6')}
        control="textarea"
        getInput={props.getReplyInputHandler}
        onChange={props.replyInputChangeHandler}
        value={props.replyInput}
        rows="3"
      />

        <div className="comment__actions">
          <Button
            mode="raised" type="submit"
            disabled={!props.replyInput || props.commentLoading}
            onClick={() => {
              props.commentPostHandler(props.replyInput, props.commentParam);
              // setReplyInput('');
            }}
          >
            {/* Post comment */}
            {t('comment.text3')}
          </Button>
        </div>

      </div>
    );





 





  return (
    <div>{replyInputElement}</div>
  )
};

export default PostCommentListReplyInput;
