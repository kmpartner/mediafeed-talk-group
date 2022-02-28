import React, { Component } from 'react';
// import { Player } from 'video-react';
// import { videoTagString, VideoTag } from 'react-video-tag'

import { withI18n } from "react-i18next";
import Linkify from 'react-linkify';

import AddFavoritePost from '../../../components/Follow/AddFavoritePost';
import Button from '../../../components/Button/Button';
import ErrorHandler from '../../../components/ErrorHandler/ErrorHandler'
import PostFavoriteUsersList from '../../../components/Follow/PostFavoriteUsersList';
import Image from '../../../components/Image/Image';
import Loader from '../../../components/Loader/Loader';
import PostComments from '../../../components/Feed/SinglePost/PostComment/PostComments';
import PostReaction from '../../../components/Feed/SinglePost/PostReaction/PostReaction';
import SmallModal from '../../../components/Modal/SmallModal';
import UserModalContents from '../../../components/Modal/UserModalContents';
import TransBackdrop from '../../../components/Backdrop/TransBackdrop';
import SinglePostImages from './SinglePostImages';
import {
  getUserLocation,
  addFavoritePost,
  deleteFavoritePost,
  getFavoritePosts,
  getFavoritePost
} from '../../../util/user';
// import { getPostFavoriteUserList } from '../../../util/follow';
import { isImageFile, isVideoFile } from '../../../util/image';
import { getDate } from '../../../util/timeFormat';
import { BASE_URL } from '../../../App';
import twitterButton from '../../../images/twitter-icon-50.png';
import './SinglePost.css';

import GroupRightElements from '../../../components/GroupTalk/GroupAdElements/GroupRightElements/GroupRightElements';
import GroupTopElements from '../../../components/GroupTalk/GroupAdElements/GroupTopElements/GroupTopElements';
import InPostsAdElements from '../../../components/GroupTalk/GroupAdElements/InPostsAdElements/InPostsAdElements';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    authorId: '',
    date: '',
    image: '',
    content: '',
    error: '',
    isLoading: false,
    creatorImageUrl: '',
    isFavorite: false,
    isPublic: '',
    favoriteUsers: [],
    selectedUserId: '',
    selectedUserName: '',
    selectedUserImageUrl: '',
    showSmallModal: false,
    showFullImageModal: false,
    geolocation: '',
    showShareElement: false,
    imageUrls: [],
    modifiedImageUrls: [],
    thumbnailImageUrls: [],
    imagePaths: [],
    modifiedImagePaths: [],
    thumbnailImagePaths: [],

    postData: null,
  };

  componentDidMount() {
    console.log('SinglePost-props', this.props);
    window.scrollTo(0, 0);
    
    if (localStorage.getItem('userId')) {
      getUserLocation()
        .then(result => {
          console.log(result);
          this.getPost();
  
        })
        .catch(err => {
          console.log(err);
          this.catchError(err);
          this.getPost();
        })
    } else {
      this.getPost();
    }
    
    //// delete selectedPostId when singlePost page loaded
    localStorage.removeItem('selectedPostId');
    localStorage.removeItem('selectedPostData');

  }

  getPost = () => {
    this.setState({ isLoading: true });

    const postId = this.props.match.params.postId;

    // console.log(postId);
    // userLocation=${localStorage.getItem('userLocation')}
    fetch(BASE_URL + '/feed/post/' + postId + `?userId=${localStorage.getItem('userId')}&userLocation=${localStorage.getItem('userLocation')}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status === 403 || res.status === 404) {
          // console.log('postId', postId);
          this.deleteFromRecentVisitPosts(postId);
          throw new Error('Failed to fetch post, or post is not public');
        }
        if (res.status !== 200) {
          throw new Error('Failed to fetch post, or post is not public');
        }
        return res.json();
      })
      .then(resData => {
        console.log('resdata')
        console.log(resData);
        this.setState({
          title: resData.post.title,
          author: resData.post.creatorName,
          authorId: resData.post.creatorId,
          // image: BASE_URL + '/' + resData.post.imageUrl,
          image: resData.post.imageUrl,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          postDate: resData.post.createdAt,
          content: resData.post.content,
          creatorImageUrl: resData.post.creatorImageUrl,
          isPublic: resData.post.public,
          isLoading: false,
          geolocation: resData.post.geolocation,
          imageUrls: resData.post.imageUrls,
          modifiedImageUrls: resData.post.modifiedImageUrls,
          thumbnailImageUrls: resData.post.thumbnailImageUrls,
          imagePaths: resData.post.imagePaths,
          modifiedImagePaths: resData.post.modifiedImagePaths,
          thumbnailImagePaths: resData.post.thumbnailImagePaths,
        
          postData: resData.post,
        },
          () => {
            console.log(this.state);
            if (this.props.isAuth) {
              // this.getFavoritePostHandler();
            }

            this.setLsRecentVisitPosts();
          });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
        this.catchError(err);
      });
  }

  storePostIdHandler = () => {
    localStorage.setItem('selectedPostId', this.props.match.params.postId);
    localStorage.setItem('selectedPostData', JSON.stringify(this.state.postData));
    // this.props.history.replace('/');
    this.props.history.push('/feed/posts');
  }

  // getFavoritePostHandler = () => {
  //   this.setState({ isLoading: true });

  //   getFavoritePost(
  //     this.props.match.params.postId,
  //     localStorage.getItem('userId'),
  //     BASE_URL,
  //     this.props.token
  //   )
  //     .then(result => {
  //       console.log(result);
  //       this.setState({ isFavorite: true });
  //       this.setState({ isLoading: false });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       // this.catchError(err);
  //       this.setState({ isLoading: false });
  //     });
  // }

  // addFavoritePostHandler = () => {
  //   this.setState({ isLoading: true });

  //   addFavoritePost(
  //     this.props.match.params.postId,
  //     localStorage.getItem('userId'),
  //     BASE_URL,
  //     this.props.token
  //   )
  //     .then(result => {
  //       console.log(result);
  //       this.setState({ isFavorite: true });
  //       this.setState({ isLoading: false });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.catchError(err);
  //       this.setState({ isLoading: false });
  //     })
  // }

  // deleteFavoritePostHandler = () => {
  //   this.setState({ isLoading: true });

  //   deleteFavoritePost(
  //     this.props.match.params.postId,
  //     localStorage.getItem('userId'),
  //     BASE_URL,
  //     this.props.token
  //   )
  //     .then(result => {
  //       console.log(result);
  //       this.setState({ isFavorite: false });
  //       this.setState({ isLoading: false });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       this.catchError(err);
  //       this.setState({ isLoading: false });
  //     })

  // }

  deleteFromRecentVisitPosts = (postId) => {
    const lsRecentVisitPosts = localStorage.getItem('recentVisitPosts');

    if (lsRecentVisitPosts) {
      const deletedList = JSON.parse(lsRecentVisitPosts).filter(post => {
        return post._id !== postId;
      });

      localStorage.setItem('recentVisitPosts', JSON.stringify(deletedList));
    }
  }

  setLsRecentVisitPosts = () => {
    let listForLs = [];
    const lsRecentVisitPosts = localStorage.getItem('recentVisitPosts');
    
    if (lsRecentVisitPosts) {
      const listLimit = 20;
      const list = JSON.parse(lsRecentVisitPosts);

      const isInList = list.find(ele => {
        return ele._id === this.state.postData._id
      });

      if (!isInList) {
        list.push(this.state.postData);

        if (list.length > listLimit) {
          list.shift();
        }

        localStorage.setItem('recentVisitPosts', JSON.stringify(list));
        return;
      } 
      else {
        const otherElList = list.filter(ele => {
          return ele._id !== this.state.postData._id;
        });

        otherElList.push(this.state.postData);

        if (otherElList.length > listLimit) {
          otherElList.shift();
        }
        localStorage.setItem('recentVisitPosts', JSON.stringify(otherElList));
        return;
      }

    } 
    else {
      listForLs.push(this.state.postData);
    }

    localStorage.setItem('recentVisitPosts', JSON.stringify(listForLs));
  }

  showFullImageModalHandler = () => {
    this.setState({ showFullImageModal: !this.state.showFullImageModal });
  }

  showSmallModalHandler = () => {
    this.setState({ showSmallModal: !this.state.showSmallModal });
  };

  selectUserHandler = (userObj) => {
    this.setState({
      selectedUserId: userObj.userId,
      selectedUserName: userObj.name,
      selectedUserImageUrl: userObj.imageUrl,
      showSmallModal: !this.state.showSmallModal
    }
      // , () => console.log(this.state.selectedUserName, this.state.selectedUserId)
    )
  }

  showSelectedUserPosts = (uid, uName) => {
    localStorage.setItem('tempUserName', uName);

    // this.props.history.replace('/');
    this.props.history.push(`/feed/userposts/${uid}`);
  }

  selectPostAuthorHandler = (userObj) => {
    this.setState({
      selectedUserId: userObj.userId,
      selectedUserName: userObj.name,
      selectedUserImageUrl: userObj.imageUrl,
      showSmallModal: !this.state.showSmallModal
    });
  }

  componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer" style={{color: 'gray', fontWeight: ''}}>
        {text}
    </a>
  );

  showShareElementHandler = () => {
    this.setState({ showShareElement: !this.state.showShareElement });
  };

  openMapHandler = () => {
    // console.log(this.state.geolocation);
    if (this.state.geolocation && this.props.isAuth && 
      this.state.authorId === localStorage.getItem('userId')
    ) {
      window.open(
        `https://postmap.watakura.xyz/?rgapitoken=${localStorage.getItem('token')}&postId=${this.props.match.params.postId}`
        )
    }
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    const { t } = this.props;
    // console.log(t);


    // console.log('singlepost-props', this.props);
    let mediaField;
    const imagePlace = this.state.image.split('?')[0];
    const fileType = imagePlace.split('.')[imagePlace.split('.').length -1].toLowerCase();
    // const fileType = this.state.image.split('.')[this.state.image.split('.').length - 1].toLowerCase();

    if (isVideoFile(fileType)) {
      mediaField = (
        <div>
          <video
            controls
            // autoPlay
            width="400"
            // width="80%"
            src={this.state.image}
          ></video>
        </div>
      );
    }

    if (isImageFile(fileType)) {
      mediaField = (
        <div className="single-post__image" onClick={this.showFullImageModalHandler}>
          <Image contain imageUrl={this.state.image} />
        </div>
      );
    }

    const favoriteUsersBody = this.state.favoriteUsers.map(user => {
      return (
        <div key={user.userId}>
          <span onClick={() => {
            this.selectUserHandler(user);
          }}
          >
            {user.name}
          </span>
        </div>
      );
    });

    let shareElement;
    if (this.state.isPublic === 'public') {
      shareElement = (
        <div>
            <div className="single-post__shareElementTitle" onClick={this.showShareElementHandler}>
              Share This Post &#9662;
            </div>
            <div className="single-post__shareElementContainer">
              {this.state.showShareElement ? 
                <a className="single-post__shareElement" href={`https://twitter.com/intent/tweet?text=post link: https://watakura.xyz/feed/${this.props.match.params.postId}`}
                  target="_blank" rel="noreferrer noopener"
                >
                  <img src={twitterButton} height="40"></img>
                </a>
                : null
              }
  
              {this.state.showShareElement && this.state.geolocation && this.props.isAuth && 
                this.state.authorId === localStorage.getItem('userId') ? 
                <span className="single-post__shareElement" 
                  onClick={this.openMapHandler}
                >
                  &#128506; share with map
                </span>
              : null
              }
  
            </div>
  
        </div>
      );
    }

    return (
      <div>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        {this.state.isLoading ?
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
          : null
        }

        {this.state.postData &&
          <div>
            <section className="single-post">
              {/* <ErrorHandler error={this.state.error} onHandle={this.errorHandler} /> */}

              {this.state.showSmallModal ?
                <div>
                  <TransBackdrop onClick={this.showSmallModalHandler} />
                  <SmallModal style="modal2">
                    <UserModalContents
                      // {...props}
                      postCreatorUserId={this.state.selectedUserId}
                      author={this.state.selectedUserName}
                      creatorImageUrl={this.state.selectedUserImageUrl}
                      setSelectedCreatorId={this.showSelectedUserPosts}
                      resetPostPage={() => { }}
                      showSmallModalHandler={this.showSmallModalHandler}
                    />
                  </SmallModal>
                </div>
                : null
              }


              {this.state.showFullImageModal ?
                  <div>
                    <TransBackdrop onClick={this.showFullImageModalHandler} />
                    <SmallModal style="fullImageModal">
                      {/* image modal */}
                      <div className="single-post__FullImageContainer">
                        <img src={this.state.image} />
                      </div>
                    </SmallModal>
                  </div>
                : null  
              }

              {/* <button onClick={() => {
                getFavoritePosts(
                  localStorage.getItem('userId'), 
                  BASE_URL,
                  this.props.token
                )
              }}>get-favoritePosts-test</button> */}

              {/* <button onClick={() => {
                getFavoritePost( 
                  this.props.match.params.postId,
                  '',
                  GQL_URL,
                  this.props.token
                )
              }}>get-favoritePost-test</button> */}

              {/* {this.state.isPublic === 'public' && this.state.isFavorite ?
                <div>favorite-indicate-test</div>
                : null
              } */}

              {mediaField}

              <div>
                <SinglePostImages 
                  imageUrls={this.state.imageUrls}
                  modifiedImageUrls={this.state.modifiedImageUrls}
                  thumbnailImageUrls={this.state.thumbnailImageUrls}
                  imagePaths={this.state.imagePaths}
                  modifiedImagePaths={this.state.modifiedImagePaths}
                  thumbnailImagePaths={this.state.thumbnailImagePaths}
                  postData={this.state.postData}
                />
              </div>

              {this.state.isLoading ?
                <Loader />
                : null}

              <h1>{this.state.title}</h1>
              <h2 onClick={() => {
                this.selectPostAuthorHandler({
                  userId: this.state.authorId,
                  name: this.state.author,
                  imageUrl: this.state.creatorImageUrl
                })
              }}
              >
                {/* Created by {this.state.author} on {this.state.date} */}
                {t('feed.text9')} {this.state.author} 
                <br/>
                {/* ({this.state.date}) */}
                ({getDate(this.state.postDate)})
              {/* <img src={BASE_URL + '/' + this.state.creatorImageUrl} alt="" height="20"></img> */}
              </h2>
              
              {this.state.content.split("\n").length >1 ?
                <p className="single-post__content">
                  <Linkify componentDecorator={this.componentDecorator}>
                    {this.state.content}
                  </Linkify>
                </p>
              :  
                <p>
                  <Linkify componentDecorator={this.componentDecorator}>
                    {this.state.content}
                  </Linkify>
                </p>
              }

              {/* smartyads */}
              <div id="block_22581"></div>

            </section>


            <section className="single-post-notcenter">
            {this.props.isAuth && localStorage.getItem('userId') === this.state.authorId ?
              <div className="single-post__editButton">
                <Button
                  mode="raised" design="" type="submit"
                  onClick={this.storePostIdHandler}
                >
                  Edit Post
                  </Button>
              </div>
              : null
            }

            <PostReaction
              userId={localStorage.getItem('userId')}
              postId={this.props.match.params.postId}
              token={this.props.token}
              isAuth={this.props.isAuth}
            />

            {shareElement}


              <div className="single-post__FavoriteButton">
                <AddFavoritePost
                  postId={this.props.match.params.postId}
                  token={this.props.token}
                />
              </div>
            

            {/* {this.state.isPublic === 'public' && this.state.isFavorite ?
                <div>favorite-indicate-test</div>
              : null
              } */}


            <div className="single-post__FavoriteUserTitle">
              <PostFavoriteUsersList
                postId={this.props.match.params.postId}
                setSelectedCreatorId={this.showSelectedUserPosts}
                resetPostPage={() => { }}
                showSmallModalHandler={this.showSmallModalHandler}
              />
            </div>
            
            <div className="single__post__adBar">
              <GroupTopElements 
                adType='300x65' 
                adPlaceId='singlepost-comment-top'
              />
              <InPostsAdElements 
                adType='inPosts' 
                adPlaceId='singlepost-comment-top' 
              />
            </div>


            <PostComments
              token={this.props.token}
              postId={this.props.match.params.postId}
              postCreatorId={this.state.authorId}
              isAuth={this.props.isAuth}
            />

            </section>
          </div>
        }


      </div>
    );
  }
}

export default withI18n()(SinglePost)
