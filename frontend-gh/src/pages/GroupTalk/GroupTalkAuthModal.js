import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Linkify from 'react-linkify';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../components/Button/Button';
import SmallModal from '../../components/Modal/SmallModal';
import TransBackdrop from '../../components/Backdrop/TransBackdrop';
import { authPageLink, authSignupPageLink } from '../../App';

const GroupTalkAuthModal = (props) => {
  console.log('GroupTalkAuthModal-props', props);
  
  const { setShowAuthModal } = props;
  
  const [t] = useTranslation('translation');



 

  // const showSmallModalHandler = () => {
  //   setShowSmallModal(!showSmallModal);
  // };




  return (
    <div >
      grouptalk-auth-modal
      <TransBackdrop onClick={() => {setShowAuthModal(false)}} />
      <SmallModal style="groupMemberModal">
              <div className="groupTalk__closeModalButtonContainer">
                <div></div>
                <div className="groupTalk__closeModalButton"
                  onClick={() => {setShowAuthModal(false)}}
                >
                  x
                </div>
              </div>
              <div>
                <div>
                  Login is required
                </div>
                  <br />
                  <div>
                    <a href={authPageLink} >
                    <Button
                          mode="raised" type="submit" design="success"
                          // disabled={!props.replyInput || props.commentLoading}
                    >
                        {/* Login */}
                        {t('general.text11')}
                      </Button>
                    </a>
                  </div>
                  <br />

                  <div>OR</div>
                  <br />
                  
                  <div>
                    <a href={authSignupPageLink} >
                      <Button
                            mode="raised" type="submit" design="success"
                            // disabled={!props.replyInput || props.commentLoading}
                      >
                        {/* Signup */}
                        {t('general.text12')}
                      </Button>
                    </a>
                </div>
              </div>
            </SmallModal>
    </div>
  );
}

export default GroupTalkAuthModal;