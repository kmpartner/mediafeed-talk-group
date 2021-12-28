import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import AutoSuggestVideoTextTalk from '../../components/AutoSuggest/AutoSuggestVideoTextTalk';
import Button from '../../components/Button/Button';

import { BASE_URL } from '../../App';
import './VideoTextTalk.css'

import SampleImage from '../../components/Image/person-icon-50.jpg';


const UserTalkList = props => {
  console.log('UserTalkList.js-props', props);

  const [t] = useTranslation('translation');

  // const [suggestInput, setSuggestInput] = useState('');
  const [suggestList, setSuggestList] = useState([]);

  useEffect(() => {
    // props.getUserTextTalkListHandler();
  },[]); 

  const withoutUserList = props.usersData.filter(user => {
    // return user._id !== props.userId;
    return user.userId !== props.userId;
  });

  const isSuggestInput = (input) => {
      // setSuggestInput(input.trim());
  };

  const getSuggestList = (list) => {
    setSuggestList(list);
  }

  let talkUserList;
  if (props.usersData.length > 0) {

    talkUserList = <ul>
      {props.usersData.map((element, index) => {
        // console.log(element);

        // const userInfo = props.usersData.find(user => {
        //   return user._id === element.pairId.split('-')[1]
        // });
        // console.log(userInfo);
        // if (element._id !== props.userId) {
        if (element.userId !== props.userId) {
          return (
          <div key={element._id}>
            <li className="textTalk-OnlineUser-list">

              <span className="textTalk__UserImageContainer">
                {/* <img className="textTalk__UserImageElement" style={!element.imageUrl ? { paddingTop:"0.5rem" } : null} 
                  src={element.imageUrl ? 
                    // BASE_URL + '/' + element.imageUrl
                    element.imageUrl
                    : SampleImage
                    }
                  alt='user-img'
                ></img> */}
                <Img className="textTalk__UserImageElement" style={!element.imageUrl ? { paddingTop:"0.5rem" } : null} 
                  src={element.imageUrl ? 
                    // BASE_URL + '/' + element.imageUrl
                    element.imageUrl
                    : SampleImage
                    }
                  alt='user-img'
                />
              </span>

              <span className="textTalk__UserName">
                {element.name} 
              </span>

              <span>
                <Button design='raised' mode='' size='smaller' 
                  onClick={() => {
                    // props.noconnectGetUserDestTalkHandler(element._id);
                    // props.showNoconnectTextTalkHandler();
                    // props.noconnectDestUserIdHandler(element._id);

                    props.noconnectGetUserDestTalkHandler(element.userId);
                    props.showNoconnectTextTalkHandler();
                    props.noconnectDestUserIdHandler(element.userId);
                  }}
                >
                  write text
                </Button>
              </span>

            </li>
          </div>
          );
        }
      })
      }
  </ul>
  }


  return (
    <div>

      {/* <div className="textTalk__UserTalkListButton">
        <Button mode="raised" type="submit" onClick={() => {
            props.showUserTextTalkListHandler();
            // props.getUserTextTalkListHandler();
          }}
        >
          {props.showUserTextTalkList ? 'Online Users': 'Text Talk'}
        </Button>
      </div> */}

      {props.showUserTextTalkList && !props.showNoconnectTextTalk ? 
        <div>
          <div className="textTalk__UserTalkList-Container">
            {talkUserList}
          </div>
        </div>
      : null
      }

      {props.showUserTextTalkList && !props.showNoconnectTextTalk ? 
        <div className={suggestList.length > 0 ? "textTalk__UserTalkListSuggest" : "textTalk__UserTalkListNoSuggest"} >
          <AutoSuggestVideoTextTalk
            // userList={props.usersData}
            userList={withoutUserList}
            noconnectGetUserDestTalkHandler={props.noconnectGetUserDestTalkHandler}
            showNoconnectTextTalkHandler={props.showNoconnectTextTalkHandler}
            noconnectDestUserIdHandler={props.noconnectDestUserIdHandler}
            userId={props.userId}
            getSuggestList={getSuggestList}
          />
        </div>
      : null
      }

    </div>
    );
}

export default UserTalkList;