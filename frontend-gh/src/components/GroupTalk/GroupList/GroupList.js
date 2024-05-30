import React from 'react';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next/hooks';

import AutoSuggestGroupList from '../../AutoSuggest/AutoSuggestGroupList'
import GroupListItem from './GroupListItem';
import { useStore } from '../../../hook-store/store';
import { getGroupImages } from '../../../util/group/group-user';
// import { getUsersForGroup } from '../../../util/user';

import { BASE_URL } from '../../../App';
import '../../../pages/GroupTalk/GroupTalk.css';


import classes from './GroupList.module.css';
import { letterBlocks } from '../../../util/color-style';


const GroupList = (props) => {
  // console.log('grouplist.js props', props);

  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  const shareGroupIdParam = queryParams.get('shareGroupId');
  const shareFileTypeParam = queryParams.get('shareFileType');

  const pageNotificationGroupRoomIdParam = queryParams.get('pageNotificationGroupRoomId');

  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();
  const { shareFile } = store.shareStore;
  const { groupImageUrls } = store;
  const { 
    groupCreatorInfoList,

   } = store.groupStore;
  // console.log('store in groupList.js', store);

  const [selectedSuggest, setSelectedSuggest] = useState(null);
  const [moreClickNum, setMoreClickNum] = useState(0);
  const [listForSuggest, setListForSuggest] = useState([]);
  
  const [sortedGroupList, setSortedGroupList] = useState([]);

  const initialListNum = 50;
  // const initialListNum = 2;

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

  useEffect(() => {
    if (props.groupList && sortedGroupList.length === 0) {
      const sortedGroupList = _.orderBy(props.groupList, ['groupName'], ['asc']);
      setSortedGroupList(sortedGroupList);
    }
  }, [props.groupList]);

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
    if (sortedGroupList.length > 0 && 
      props.groupList && props.groupList.length > 0
    ) {
      
      let sortedGList = sortedGroupList;
      // console.log(sortedGroupList);
      
      if (selectedSuggest) {
        const suggestGroupInfo = sortedGList.find(element => {
          return selectedSuggest.groupRoomId === element.groupRoomId;
        });
  
        sortedGList = [suggestGroupInfo];
        // console.log(sortedGroupList);
      }

      const newDisplayGList = sortedGList.slice(initialListNum * moreClickNum, initialListNum * (moreClickNum + 1));

      const requestIdList = [];

      for (const group of newDisplayGList) {
        const isInList = groupImageUrls.find(ele => {
          return ele.groupRoomId === group.groupRoomId;
        });

        if (!isInList) {
          requestIdList.push(group.groupRoomId);
        }
      }

      if (requestIdList.length === 0) {
        return;
      }



      getGroupImages(BASE_URL, localStorage.getItem('token'), requestIdList)
        .then(result => {
          console.log(result);

          const addedList = groupImageUrls.concat(result.data);
          const uniqList = _.uniqBy(addedList, 'groupRoomId');
          dispatch('SET_GROUP_IMAGEURLS', uniqList);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },[props.groupList, sortedGroupList, moreClickNum, selectedSuggest]);


  useEffect(() => {
    if (shareFile && shareGroupIdParam) {
      props.showGroupTalkTextHandler(
        shareGroupIdParam, 
        shareGroupIdParam,
        shareFileTypeParam,
      );
      props.getGroupInfoHandler(shareGroupIdParam); 
      // props.addVisitGroupIdHandler(
      //   group.groupRoomId,
      //   group.creatorUserId,
      // );
    }
  },[shareFile, shareGroupIdParam]);

  useEffect(() => {
    if (pageNotificationGroupRoomIdParam) {
      props.showGroupTalkTextHandler(
        pageNotificationGroupRoomIdParam, 
        pageNotificationGroupRoomIdParam,
        null,
      );
      props.getGroupInfoHandler(pageNotificationGroupRoomIdParam); 
      // props.addVisitGroupIdHandler(
      //   group.groupRoomId,
      //   group.creatorUserId,
      // );
    }
  },[pageNotificationGroupRoomIdParam]);



  // useEffect(() => {
  //   if (!selectedSuggest && sortedGroupList.length > 0) {
  //     const groupsForCreator = sortedGroupList.slice(0, initialListNum * (moreClickNum + 1));
  //     getCreatorInfoListHandler(groupsForCreator, groupCreatorInfoList);
  //   }

  //   if (selectedSuggest) {
  //     const suggestGroupInfo = sortedGroupList.find(element => {
  //       return selectedSuggest.groupRoomId === element.groupRoomId;
  //     });

  //     getCreatorInfoListHandler([suggestGroupInfo], groupCreatorInfoList);
  //   }

  // },[sortedGroupList, selectedSuggest]);



  // const getSuggestList = (list) => {
  //   setSuggestList(list);
  // }

  const getSelectedSuggest = (obj) => {
    console.log(obj);
    setSelectedSuggest(obj);
  };

 


  let groupListBody
  if (props.groupList.length > 0 && sortedGroupList.length > 0) {
    // console.log(props.groupList);

    let sortedGList = sortedGroupList;
    // console.log(sortedGroupList);
    
    if (selectedSuggest) {
      const suggestGroupInfo = sortedGList.find(element => {
        return selectedSuggest.groupRoomId === element.groupRoomId;
      });

      sortedGList = [suggestGroupInfo];
      // console.log(sortedGroupList);
    }

    groupListBody = <ul>
      {sortedGList.slice(0, initialListNum * (moreClickNum + 1)).map((group) => {

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