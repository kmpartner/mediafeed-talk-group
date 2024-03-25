import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';

import AutoSuggestUser from '../AutoSuggest/AutoSuggestUser';
import Button from '../Button/Button';
import AddFollowUser from '../Follow/AddFollowUser';
import FollowUsersList from '../Follow/FollowUsersList';
import Loader from '../Loader/Loader';
import { 
  // getUsers, 
  // addFollowingUserId, 
  // deleteFollowingUserId,
  getFollowingUsers
} from '../../util/user';
import { updateLsNameDataList } from '../../util/user-name-data/user-name-data-util';
// import { useStore } from '../../hook-store/store';

import { BASE_URL } from '../../App';
import './UserModalContents.css';

import SampleImage from '../Image/person-icon-50.jpg';

const UserModalContents = props => {
  console.log('UserModalContents-props', props);
  const [t] = useTranslation('translation');

  const lsUserId = localStorage.getItem('userId');

  // const [store, dispatch] = useStore();
  // console.log('store in UserModalContents.js', store);

  const [userList, setUserList] = useState([]);
  const [searchSelectedUser, setSearchSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  // useEffect(() => {
  //   if (store.usersData.length === 0) {

  //     setIsLoading(true);
  
  //     getUsers(BASE_URL, localStorage.getItem('token'))
  //       .then(result => {
  //         console.log(result);
  //         // setUserList(result.usersData);
  //         dispatch('SET_USERSDATA', result.usersData);
  
  //         setIsLoading(false);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setIsLoading(false);
  //       })
  //   }
      
  // },[]);

  useEffect(() => {
    if (lsUserId) {
      const lsFollowingUsers = localStorage.getItem('followingUsers');
      
      if (lsFollowingUsers) {
        const parsedData = JSON.parse(lsFollowingUsers);
  
        if (
          (parsedData.userId && parsedData.userId !== lsUserId) ||
          parsedData.getDate < Date.now() - 1000 * 60 * 60 * 24
        ) {
          getFollowIdsHandler();
        }
      } else {
        getFollowIdsHandler();
      }
    } else {
      localStorage.removeItem('followingUsers');
    }
  },[]);

  const getFollowIdsHandler = () => {
    setIsLoading(true);

    getFollowingUsers(
      lsUserId, 
      BASE_URL, 
      localStorage.getItem('token')
    )
    .then(result => {
      console.log(result);

      localStorage.setItem(
        'followingUsers', 
        JSON.stringify({
          userId: lsUserId,
          getDate: Date.now(),
          data: result.data
        })
      );

      if (result.userNameDataList?.length > 0) {
        updateLsNameDataList(result.userNameDataList, null);
      }

      setIsLoading(false);
    })
    .catch(err => {
      console.log(err);
      setIsLoading(false);
    });
  };

  // const addFollowIdHandler = () => {
  //   setIsLoading(true);

  //   addFollowingUserId(
  //     localStorage.getItem('userId'), 
  //     props.postCreator_id, 
  //     BASE_URL, 
  //     localStorage.getItem('token')
  //   )    
  //   .then(result => {
  //     console.log(result);
  //     setIsLoading(false);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     setIsLoading(false);
  //   });
  // };

  // const deleteFollowIdHandler = () => {
  //   setIsLoading(true);

  //   deleteFollowingUserId(
  //     localStorage.getItem('userId'), 
  //     props.postCreator_id, 
  //     BASE_URL, 
  //     localStorage.getItem('token')
  //   )
  //   .then(result => {
  //     console.log(result);
  //     setIsLoading(false);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     setIsLoading(false);
  //   });
  // };

  let body;
  if (isLoading) {
    body = (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Loader />
        </div>
    );
  } else {
    body = (
      <div>
        
        {/* <div className="userModalContent__suggestContainer">
          {localStorage.getItem('userId') ?
            <AutoSuggestUser 
              userList={userList}
              setSearchSelectedUser={setSearchSelectedUser}
              setSelectedCreatorId={props.setSelectedCreatorId}
              resetPostPage={props.resetPostPage}
              showSmallModalHandler={props.showSmallModalHandler}
            />
          :null
          }
        </div> */}
  
        {searchSelectedUser && (
            <div className="post__AuthorElement userModalContent__selectedUser">
              <span className="post__AuthorImageContainer">
              
              {searchSelectedUser.imageUrl ?
                // <img className="post__AuthorImageElement"
                //   src={BASE_URL + '/' + searchSelectedUser.imageUrl} alt=""
                // />
                <img className="post__AuthorImageElement"
                  src={searchSelectedUser.imageUrl} alt=""
                />
                :
                <img className="post__AuthorImageElement"
                  src={SampleImage} alt=""
                />
              }

              </span>
              <span className="post__AuthorName">
                {searchSelectedUser.name}
              </span>
              <span>
                <Button mode="flat" design="" size="smaller" onClick={() => {
                    props.setSelectedCreatorId(searchSelectedUser._id, searchSelectedUser.name);
                    props.resetPostPage();
                    props.showSmallModalHandler();
                  }}
                >
                  {t('feed.text2', 'show user posts')}
                </Button>
              </span>
          </div>
          )
        }
        
        <div className="post__AuthorElement userModalContent__selectedUser">
          <span className="post__AuthorImageContainer">
            {/* {props.creatorImageUrl ?
              <img className="post__AuthorImageElement"
                src={props.creatorImageUrl} alt=""
              />
            :
              <img className="post__AuthorImageElement"
                src={SampleImage} alt=""
              />
            } */}
            {props.nameData?.imageUrl && (
              <img className="post__AuthorImageElement"
                // style={{height: "1rem", width: "1rem", objectFit: "cover"}}
                src={props.nameData.imageUrl} 
              />
            )}
            {!props.nameData?.imageUrl && (
              <img className="post__AuthorImageElement"
                src={SampleImage} alt=""
              />
            )}
          </span>
          <span className="post__AuthorName">
            {/* {props.author} */}
            {props.nameData && (
              <span>{props.nameData.name}</span>
            )}
          </span>
          <span>
          <Button mode="flat" design="" size="smaller" onClick={() => {
            props.setSelectedCreatorId(props.postCreatorUserId, props.author);
            props.resetPostPage();
            props.showSmallModalHandler();
          }}
          >
            {t('feed.text2', 'show user posts')}
          </Button>
          </span>

          {/* <button onClick={addFollowIdHandler}>add-follow-test</button>
          <button onClick={deleteFollowIdHandler}>delete-follow-test</button>
          <button onClick={getFollowIdsHandler}>get-follows-test</button> */}

        </div>

        {lsUserId ?
          <div>
            <AddFollowUser 
              postCreatorUserId={props.postCreatorUserId}
              author={props.author}
              getFollowIdsHandler={getFollowIdsHandler}
            />

            <FollowUsersList
              // {...props}
              setSelectedCreatorId={props.setSelectedCreatorId}
              resetPostPage={props.resetPostPage}
              showSmallModalHandler={props.showSmallModalHandler}
            />
          </div>
        
        : null
        }
      </div>
    );
  }

  return (
    <div>
      {body}
    </div>
  )
};

export default UserModalContents;