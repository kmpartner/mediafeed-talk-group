import React from 'react';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next/hooks';

import AutoSuggestGroupList from '../../AutoSuggest/AutoSuggestGroupList'
import GroupListItem from './GroupListItem';
import { useStore } from '../../../hook-store/store';

import { BASE_URL } from '../../../App';
import '../../../pages/GroupTalk/GroupTalk.css';


import classes from './GroupList.module.css';
import { letterBlocks } from '../../../util/color-style';


const GroupList = (props) => {
  console.log('grouplist.js props', props);

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  // console.log('store in groupList.js', store);

  const [selectedSuggest, setSelectedSuggest] = useState(null);
  const [moreClickNum, setMoreClickNum] = useState(0);
  const [listForSuggest, setListForSuggest] = useState([]);

  const initialListNum = 50;

  useEffect(() => {
    window.scrollTo(0, 0);

    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //   console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
    //   setMoreClickNum(moreClickNum + 1);
    // }
    // window.onscroll = (ev) => {
    //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //     console.log(window.innerHeight, window.scrollY, document.body.offsetHeight);
    //     setMoreClickNum(moreClickNum + 1);
    //   }
    // };
  }, []);

  // useEffect(() => {
  //   console.log('moreClickNum', moreClickNum);
  //   window.onscroll = (ev) => {
  //     console.log(window.innerHeight, window.scrollY, document.body.offsetHeight);
  //     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        
  //       setMoreClickNum(moreClickNum + 1);
  //     }
  //   };
  // },[moreClickNum]);

  useEffect(() => {
    //// create group list for autoSuggest
    if (props.groupList.length > 0) {

      const listForSuggest = [];
  
      for (const group of props.groupList) {
        // const creatorInfo = props.usersData.find(element => {
        //   return element.userId === group.creatorUserId
        // });
  
        listForSuggest.push({
          groupRoomId: group.groupRoomId,
          groupName: group.groupName,
          creatorUserId: group.creatorUserId,
          // creatorInfo: creatorInfo,
          keywords: group.keywords,
        });
      }
  
      setListForSuggest(listForSuggest);
    }

  },[props.groupList]);

  useEffect(() => {
    if (props.groupList 
        && props.groupList.length > 0 
        && store.groupImageUrls.length === 0
    ) {
      getGroupImages(BASE_URL, localStorage.getItem)
        .then(result => {
          console.log(result);

          dispatch('SET_GROUP_IMAGEURLS', result.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },[props.groupList]);


  // const getSuggestList = (list) => {
  //   setSuggestList(list);
  // }

  const getSelectedSuggest = (obj) => {
    console.log(obj);
    setSelectedSuggest(obj);
  };

  const getGroupImages = (url, token) => {
    return new Promise((resolve, reject) => {

      fetch(url + '/group-image/group-images', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Getting group images failed!');
          }
          return res.json();
        })
        .then(resData => {
          // console.log(resData);
          resolve({ message: 'Get group images.', data: resData.data });
  
        })
        .catch(err => {
          console.log(err);
          reject({ message: 'Get group images failed.',  error: err })
        });
  
        // return Promise;
    })
  }
  

  
  let groupListBody
  if (props.groupList.length > 0) {
    // console.log(props.groupList);

    let sortedGroupList = _.orderBy(props.groupList, ['groupName'], ['asc']);
    // console.log(sortedGroupList);
    
    if (selectedSuggest) {
      const suggestGroupInfo = props.groupList.find(element => {
        return selectedSuggest.groupRoomId === element.groupRoomId;
      });

      sortedGroupList = [suggestGroupInfo]
      // console.log(sortedGroupList);
    }

    groupListBody = <ul>
      {sortedGroupList.slice(0, initialListNum * (moreClickNum + 1)).map((group) => {

        if (props.joinGroupId) {
          return null;
        } 
        else {
          return (
            <div key={group._id} className="groupList-listContainer" 
              // onClick={() => {joinGroupHandler(group.groupRoomId)}}
            >
              {/* _id: {group._id}  */}
              <GroupListItem 
                group={group}
                showGroupTalkTextHandler={props.showGroupTalkTextHandler}
                getGroupInfoHandler={props.getGroupInfoHandler}
                updateGroupStartHandler={props.updateGroupStartHandler}
                usersData={props.usersData}
                userId={props.userId}
                deleteGroupHandler={props.deleteGroupHandler}
                deleteGroupResult={props.deleteGroupResult}
                isLoading={props.isLoading}
              />
            </div>
          );  
        }
      })}
    </ul>
  }



  return (
    <div>
      {/* <div>Group-List</div> */}

      {/* <button onClick={() => {props.getGroupUserHandler(props.userId)}}>
        get-group-user-test
      </button> */}

      {/* <div>color-random-test</div>
      <button type="button" onClick={letterBlocks}>Generate Letter Blocks</button>
      <label>
        - optionally lighten colors near pure blue:<input type="checkbox" id="boost" />
      </label>
      <p id="blocks" style={{lineHeight:"2.5rem", fontSize:"2rem"}}></p> */}
      

      <div className="groupList-autoSuggestContainer">
      <AutoSuggestGroupList
        groupList={listForSuggest}
        // userList={listForSuggest}
        listType="listForSuggest"
        // callUser={callUser}
        // startTalkButton={startTalkButton}
        // getSuggestList={getSuggestList}
        // getSuggestObj={getSuggestObj}
        getSelectedSuggest={getSelectedSuggest}
      />
      </div>
      <div>{groupListBody}</div>

      {props.groupList.length > 0 && (moreClickNum + 1) * initialListNum < props.groupList.length &&
        <div className={classes.groupListShowMoreButton}
          onClick={() => {
              setMoreClickNum(moreClickNum + 1)
            }}
          >
          show more group &#9662;
        </div>
      }
    </div>
  );
}

export default GroupList;