import React, { useState } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import Backdrop from '../../Backdrop/Backdrop';
import Button from '../../Button/Button';
import InputEmoji from '../../Form/Input/InputEmoji';
import SmallModal from '../../Modal/SmallModal';
import GroupUpload from '../GroupUpload/GroupUpload';

import { authPageLink, authSignupPageLink } from '../../../App';

import classes from './GroupTalkTextInput.module.css';

const GroupTalkTextInput = props => {
  // console.log('GroupTalkTextInput.js-props', props);

  const [t] = useTranslation('translation');
  
  const [showUploadModal, setShowUploadModal] = useState(false);

  const showUploadModalHandler = (value) => {
    setShowUploadModal(value);
  };

  let inputBody;
  if (props.isAuth && props.isMember) {
    inputBody = (
      <div className="groupTalk__textInputElements">
      <div className="groupTalk__textInputTextarea">
        <InputEmoji
          type="text"
          label=""
          // placeholder="text input...."
          placeholder={t('videoTalk.text10')}
          control="textarea"
          getInput={props.getInputHandler}
          onChange={props.textInputHandlerEmoji}
          value={props.groupTextInput}
          rows="3"
          pickerStyle={{ position: 'fixed', top: '60px', bottom:'90px', left: '0px', zIndex: '300', maxHeight:'90vh', maxWidth:'75%', overflow:'auto'}}
        />
      </div>
      <div className="groupTalk__textInputPostButton">
        <Button
          mode="raised" type="submit"
          disabled={!props.groupTextInput || props.isTextPosting}
          loading={props.isTextPosting}
          onClick={() => {
            if (!props.isAuth || !props.isMember) {
              props.setShowAuthModal(true);
            } else {
              props.groupTextPostHandler(props.groupTextInput, props.joinGroupId);
            }
            // textPostHandler(textInput);
          }}
        >
          {t('general.text26', 'Send')}
        </Button>
        <Button mode="" type=""
          onClick={() => { showUploadModalHandler(true); }}
        >
          {t('talkUpload01', 'upload file')}
        </Button>
      </div>

      {showUploadModal && (
          <div>
            <Backdrop onClick={() => { showUploadModalHandler(false); }}/>
            <SmallModal style={classes.uploadModal}>
              <GroupUpload
                showUploadModalHandler={showUploadModalHandler}
                // textInput={props.textInput}
                // noconnectDestUserId={props.noconnectDestUserId}
                // noconnectTextPostHandler={props.noconnectTextPostHandler}
                
                joinGroupId={props.joinGroupId}
                groupTextPostHandler={props.groupTextPostHandler}
                isTextPosting={props.isTextPosting}
              />
            </SmallModal>
          </div>
        )}
      {/* {props.showGroupTextInputElement ?
          <div
            className="groupTalk__showInputButton"
            // style={{position: "fixed", bottom:"75px", right:"1px"}}
            onClick={() => {
              props.showGroupTextInputElementHandler();
              // textPostHandler(textInput);
            }}
          >
            <Button
              mode="raised" type="submit"
              // disabled={!groupTextInput}
              onClick={() => {
                props.showGroupTextInputElementHandler();
                // textPostHandler(textInput);
              }}
            >
              hide-input
        </Button>
          </div>
          :
          <div className="groupTalk__showInputButton"
          // style={{fontSize:"0.75rem", width:"40%", bottom:"1px"}}
          >
            <Button
              mode="raised" type="submit"
              // disabled={!groupTextInput}
              onClick={() => {
                props.showGroupTextInputElementHandler();
                // textPostHandler(textInput);
              }}
            >
              write-text
              </Button>
          </div>
        } */}

    </div>
    );
  }
  else {
    inputBody = (
      <div>
        {!props.isLoading &&
          <span>
            {/* Joining group after Login is requred to post comment */}
            {t('groupTalk.text20', 
              'Joining group after Login is requred to post comment'
            )}
          </span>
        }
        {!props.isAuth &&
          <div>
            <br />
            <span>
              <a href={authPageLink} >
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  {/* Login */}
                  {t('general.text11')}
                </Button>
              </a>
            </span>

            <span> OR </span>

            <span>
              <a href={authSignupPageLink} >
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  {/* Signup */}
                  {t('general.text12')}
                </Button>
              </a>
            </span>
          </div>
        }
      </div>
    );
  }
  return (
    <div>
      {inputBody}
    </div>
  );
}

export default GroupTalkTextInput;