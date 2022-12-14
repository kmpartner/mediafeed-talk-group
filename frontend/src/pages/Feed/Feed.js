import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';
import { withI18n } from "react-i18next";
import axios from 'axios';
// import Resizer from 'react-image-file-resizer'; 

import AutoSuggestHook from '../../components/AutoSuggest/AutoSuggestHook';
import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import FeedImages from '../../components/Feed/UserPost/FeedImages';
import FeedSocketAction from '../../components/Feed/FeedSocketAction/FeedSocketAction';
// import FeedVideos from '../../components/Feed/UserPost/FeedVideos';
// import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import PostSelect from '../../components/Feed/PostSelect/PostSelect';
import StartNewLive from '../../components/Feed/StartNewLive/StartNewLive';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import { getUserLocation, getFavoritePosts } from '../../util/user';
import { postUpdatePushHandler } from '../../util/pushNotification'
import { createWithAdIndexList } from '../../util/ad-visit';
import { deleteLsFavoritePost, updateLsFavoritePosts } from '../../util/feed/favorite-post';
import { isAudioFile, isVideoFile } from '../../util/image';
import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';

import GetWindowData from '../../components/UI/getWindowData';

import './Feed.css';

import { BASE_URL, PUSH_URL } from '../../App';


class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
    userOnly: false,
    userPostPage: 1,
    perUserPostPage: 2,
    userPosts: [],
    geolocation: '',
    imageDeleted: null,
    userPageSelect: 'posts',
    moreClickNum: 0,
    searchPosts: [],

    perPage: 20,
    maxPagePostNumber: 20,
    maxSearchPostNumber: 20, // less than maxPagePostNumber
    
    // perPage: 2,
    // maxPagePostNumber: 2,
    // maxSearchPostNumber: 2, // less than maxPagePostNumber
    
    // perPage: 6,
    // maxPagePostNumber: 6,
    // maxSearchPostNumber: 6, // less than maxPagePostNumber
    

    searchPostPage: 1,
    searchMoreClickNum: 0,
    selectedCreatorId: '',
    selectedCreatorName: '',
    isFavoritePosts: false,
    // postsForSuggest: [],
    // searchSelectPostId: null,

    postDeleteResult: '',
    isPostDeleting: false,

    postFilter: '',

    windowValues: null,
    uploadProgress: 0,

    newLiveStart: false,
  };

  componentDidMount() {
    console.log('Feedjs-props', this.props);

    if (this.props.isAuth) {
      fetch(BASE_URL + '/auth/status', {
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
        .then(res => {
          if (res.status !== 200) {
            throw new Error('Failed to fetch user status.');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
          this.setState({ status: resData.status });
        })
        .catch(this.catchError);
    }

    this.loadPosts();

    const socket = openSocket(BASE_URL);
    socket.on('posts', data => {
      if (data.action === 'create') {
        // this.addPost(data.post);
      } else if (data.action === 'update') {
        // this.updatePost(data.post);
      } else if (data.action === 'delete') {
        // this.loadPosts();
      } else if (data.action === 'action') {
        console.log('IN SOCKET.ON action');
        // this.loadPosts();
      }

       //// other actions in FeedSocketAction.js
       
    })

    if (localStorage.getItem('deletePostId') && localStorage.getItem('deletePostData') ) {
      console.log('deletePostData', JSON.parse(localStorage.getItem('deletePostData')));
      
      const filePath = JSON.parse(localStorage.getItem('deletePostData')).imagePaths[0];
      if (filePath) {
        const fileType = filePath.split('.').pop();
        const isVideo = isVideoFile(fileType);

        console.log('deletepostData', filePath, fileType, isVideo);

        this.deleteMultiImagePostHandler(localStorage.getItem('deletePostId'), isVideo);
      } 
      else {
        this.deleteMultiImagePostHandler(localStorage.getItem('deletePostId'), false);
      }
    }

  }

  addPost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      // if (prevState.postPage === 1) {
      //   if (prevState.posts.length >= 2) {
      //     updatedPosts.pop();
      //   }
      //   updatedPosts.unshift(post);
      // }

      updatedPosts.unshift(post);
      console.log(prevState.totalPosts);
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1
      };
    });
  }

  updatePost = post => {
    this.setState(prevState => {
      const updatedPosts = [...prevState.posts];
      const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      return {
        posts: updatedPosts
      }
    });

  }

  selectedPostEditHandler = (postId) => {
    // const pId = localStorage.getItem('selectedPostId');
    // this.startEditPostHandler(postId);
    // localStorage.removeItem('selectedPostId');

    this.setState(prevState => {
      // const loadedPost = { ...prevState.posts.find(p => p._id === postId) };
      const loadedPost = JSON.parse(localStorage.getItem('selectedPostData'));
      console.log(loadedPost);

      getUserLocation()
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
          this.catchError(err);
        })

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  }

  morePostHandler = () => {
    // console.log(this.state.moreClickNum * this.state.perPage, this.state.posts.length);
    if (this.state.posts.length && this.state.moreClickNum * this.state.perPage > this.state.posts.length) {
      return;
    } else {
      this.setState({ moreClickNum: this.state.moreClickNum + 1 });
    }
  }

  moreSearchPostHandler = () => {
    // console.log(this.state.searchMoreClickNum * this.state.perPage, this.state.searchPosts.length);
    if (this.state.searchPosts.length && this.state.searchMoreClickNum * this.state.perPage > this.state.searchPosts.length) {
      return;
    } else {
      this.setState({ searchMoreClickNum: this.state.searchMoreClickNum + 1 });
    }
  }

  resetSearchPostPage = () => {
    this.setState({ searchPostPage: 1 });
  }

  getSearchPosts = (posts) => {
    this.setState({ searchPosts: posts }, 
      () => console.log(this.state.searchPosts)
    );
  }

  setSelectedCreatorId = (creatorId, creatorName) => {
    this.setState({ 
      selectedCreatorId: creatorId,
      selectedCreatorName: creatorName
     }, () => {
       console.log(this.state.selectedCreatorId, this.state.selectedCreatorName)
     });

    //  this.props.history.replace('/');
    //  this.props.history.push(`/feed/userposts/${creatorId}`);

     localStorage.removeItem('tempUserName');
  }
  resetSelectedCreatorId = () => {
    this.setState({ 
      selectedCreatorId: '',
      postPage: 1
    }, 
      () => this.loadPosts()
    );

    // this.props.history.replace('/');
    this.props.history.push(`/feed/posts`);
  }

  resetPostPage = () => {
    this.setState({ postPage: 1 }, 
      () => this.loadPosts()
    );
  }

  // setSelectedCreatorPosts = (creatorId) => {
  //   const creatorPosts = this.state.posts.filter(post => {
  //     return post.creatorId === creatorId;
  //   });
  //   this.setState({ selectedCreatorPosts: creatorPosts },
  //     () => console.log(this.state.selectedCreatorPosts));
  // }


  getFavoritePostsHandler = () => {
    this.setState({ postsLoading: true });

    const lsUserId = localStorage.getItem('userId');
    let lsUserFavoritePosts = localStorage.getItem('userFavoritePosts');
    if (lsUserFavoritePosts) {
      lsUserFavoritePosts = JSON.parse(lsUserFavoritePosts);

      //// check update of ls favarite posts in loaded posts
      // if (lsUserFavoritePosts.posts.length > 0) {
      //   for (const post of this.state.posts) {
      //     // console.log(post);
      //     // updateLsFavoritePosts(post);
      //   }
      // }

    }

    if (lsUserId) {
      if (lsUserFavoritePosts 
          && lsUserId === lsUserFavoritePosts.userId 
          && lsUserFavoritePosts.getDate > Date.now() - 1000 * 60 * 60
          // && lsUserFavoritePosts.getDate > Date.now() - 1000
        ) {
          this.setState({ 
            posts: lsUserFavoritePosts.posts,
            totalPosts: lsUserFavoritePosts.posts.length,
            postsLoading: false
          });
      } 
      else {
        getFavoritePosts(lsUserId, BASE_URL, this.props.token)
        .then(result => {
          console.log(result);
          this.setState({ 
            posts: result.data,
            totalPosts: result.data.length,
            postsLoading: false
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            posts: [],
            totalPosts: 0, 
            postsLoading: false 
          });
        });
      }
      
    }
  }

  favoritePostsClickHandler = () => {
      this.setState({ 
        isFavoritePosts: !this.state.isFavoritePosts },
        () => {
          if (this.state.isFavoritePosts) {
            this.getFavoritePostsHandler();
          } else { this.loadPosts(); }
        })
  }



  loadPosts = direction => {


    this.setState({ postsLoading: true });



    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    let searchPage = this.state.searchPostPage;

    console.log('before previous before next totalPosts', this.state.totalPosts)
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }



    console.log('after previous');

    if (this.state.searchPosts.length > 0) {
      if (direction === 'searchNext') {
        searchPage++;
        this.setState({ searchPostPage: searchPage });
      }
      if (direction === 'searchPrevious') {
        searchPage--;
        this.setState({ searchPostPage: searchPage });
      }
    }



    const lsUserId = localStorage.getItem('userId');
    let queryEnd;
    queryEnd = BASE_URL + '/feed/posts?page=' + page + `&userpost=${this.state.userOnly.toString()}&userId=${lsUserId}`;
    
    if (this.state.postFilter === 'most-visit-posts') {
      queryEnd = BASE_URL + '/feed-filter/most-visit-posts?page=' + page + `&userpost=${this.state.userOnly.toString()}&userId=${lsUserId}`;
    }

    if (this.state.postFilter === 'most-like-posts') {
      queryEnd = BASE_URL + '/feed-filter/most-reaction-posts?page=' + page + `&userpost=${this.state.userOnly.toString()}&type=Like`;
    }

    if (this.state.selectedCreatorId) {
      queryEnd = BASE_URL + '/feed/user-public-posts?page=' + page + `&userpost=${this.state.userOnly.toString()}&userId=${this.state.selectedCreatorId}`;
    }


    fetch(queryEnd, {
      headers: {
        // Authorization: 'Bearer ' + this.props.token,
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        // console.log(resData.posts[0].creator._id)


        let postDataList = resData.posts;

        const pathParts = window.location.pathname.split('/');

        if (this.state.selectedCreatorId) {
          postDataList = postDataList.filter(post => {
            // console.log(post.creatorId, this.state.selectedCreatorId);
            return post.creatorId === this.state.selectedCreatorId;
          });
        }

        if (pathParts[2] === 'userposts' && pathParts[3]) {
          postDataList = postDataList.filter(post => {
            return post.creatorId === pathParts[3];
          });
          if (localStorage.getItem('tempUserName')) {
            this.setSelectedCreatorId(pathParts[3], localStorage.getItem('tempUserName'));
          }
        }

        // console.log(this.state.selectedCreatorId, postDataList)

        this.setState({
          posts: postDataList.map(post => {
            return {
              ...post,
              // imagePath: post.imageUrl
            }
          }),
          // totalPosts: resData.totalItems,
          totalPosts: postDataList.length,
          postsLoading: false
        });

        if (this.state.editPost) {
          this.updateEditPostHandler(this.state.editPost._id);
        }

        //// post edit from singlepost page
        if (localStorage.getItem('selectedPostId')) {
          this.selectedPostEditHandler(localStorage.getItem('selectedPostId'));
        }
        // localStorage.removeItem('selectedPostId');


        // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        //   console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
        //   this.morePostHandler();
        //   this.moreSearchPostHandler();
        // }
        // window.onscroll = (ev) => {
        //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        //     // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
        //     this.morePostHandler();
        //     this.moreSearchPostHandler();
        //   }
        // };

      })
      .catch(err => {
        console.log(err);
        // this.catchError;

        this.setState({ postsLoading: false });
      })
  };

  // statusUpdateHandler = event => {
  //   event.preventDefault();

  //   let userLocation;
  //   if (this.state.geolocation.coords) {
  //     const geoData = this.state.geolocation
  //     userLocation = {
  //       coords: {
  //         latitude: geoData.coords.latitude,
  //         longitude: geoData.coords.longitude,
  //         altitude: geoData.coords.altitude,
  //         accuracy: geoData.coords.accuracy,
  //         altitudeAccuracy: geoData.coords.altitudeAccuracy,
  //         heading: geoData.coords.heading,
  //         speed: geoData.coords.speed,
  //       },
  //       timestamp: geoData.timestamp,
  //     }
  //   }

  //   fetch(BASE_URL + '/auth/status', {
  //     method: 'PATCH',
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.token,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       status: this.state.status,
  //       geolocation: userLocation,
  //     })
  //   })
  //     .then(res => {
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error("Can't update status!");
  //       }
  //       return res.json();
  //     })
  //     .then(resData => {
  //       console.log(this.state.geolocation);
  //       console.log(resData);
  //     })
  //     .catch(this.catchError);
  // };

  newPostHandler = () => {
    this.setState({ isEditing: true });

    getUserLocation()
      .then(result => {
        console.log(result);
        // const locationData = result.data;

        // return updateUserLocation(
        //   '', locationData, BASE_URL, this.props.token
        //   )
        //   .then(updateResult => {
        //     console.log(updateResult);
        //   })
        //   .catch(err => {
        //     console.log(err);
        //     this.catchError(err);
        //   })

      })
      .catch(err => {
        console.log(err);
        this.catchError(err);
      })

  };

  onlyUserHandler = () => {
    this.setState({
      userOnly: !this.state.userOnly,
      isFavoritePosts: false
    }, () => { this.loadPosts(); }
    );
  }

  showUserPostsHandler = () => {
    this.setState({
      userOnly: true,
      isFavoritePosts: false,

      selectedCreatorId: '',
      postPage: 1,

      postFilter: 'user-posts',
    }, () => { this.loadPosts(); }
    );
  }

  showRecentPostsHandler = () => {
    this.setState({
      userOnly: false,
      isFavoritePosts: false,

      selectedCreatorId: '',
      postPage: 1,

      postFilter: 'posts',
    }, () => { this.loadPosts(); }
    );
  }

  showFavoritePostsHandler = () => {
    this.setState({ 
      isFavoritePosts: true,

      userOnly: false,
      selectedCreatorId: '',
      postPage: 1,

      postFilter: 'favorite-posts',
    }, () => { 
      this.getFavoritePostsHandler(); 
    });
  }

  showMostViewedPostsHandler = () => {
    this.setState({ 
      postFilter: 'most-visit-posts',

      userOnly: false,
      isFavoritePosts: false,

      selectedCreatorId: '',
      postPage: 1
    }, () => { this.loadPosts(); });
  }

  showMostLikedPostsHandler = () => {
    this.setState({ 
      postFilter: 'most-like-posts',

      userOnly: false,
      isFavoritePosts: false,

      selectedCreatorId: '',
      postPage: 1
    }, () => { this.loadPosts(); });
  }

  showRecentVisitPostsHandler = () => {
    const lsRecentVisitPosts = localStorage.getItem('recentVisitPosts');
    let displayPosts = [];
    
    if (lsRecentVisitPosts) {
      displayPosts = JSON.parse(lsRecentVisitPosts).filter(post => {
        // return post.public === 'public' || post.creatorId === localStorage.getItem('userId');
        return post;
        return post.public === 'public';
      });
    }

    this.setState({ 
      postFilter: 'recent-visit-posts',

      userOnly: false,
      isFavoritePosts: false,

      selectedCreatorId: '',
      postPage: 1,

      //// may handle in loadPosts()
      posts: displayPosts.reverse(),
      totalPosts: displayPosts.length,
    }, () => { 
      // this.loadPosts(); 
    });
  }

  userPostPageHandler = (input) => {
    if (input === 'up') {
      this.setState({
        userPostPage: this.state.userPostPage + 1
      })

    } else {
      this.setState({
        userPostPage: this.state.userPostPage - 1
      })

    }
  }

  perUserPostPageHandler = (input) => {
    this.setState({
      perUserPostPage: input
    })
  }

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };
      console.log('loadedPost', loadedPost);

      getUserLocation()
        .then(result => {
          console.log(result);
          // const locationData = result.data;

          // return updateUserLocation(
          //   '', locationData, BASE_URL, this.props.token
          //   )
          //   .then(updateResult => {
          //     console.log(updateResult);
          //   })
          //   .catch(err => {
          //     console.log(err);
          //     this.catchError(err);
          //   })

        })
        .catch(err => {
          console.log(err);
          this.catchError(err);
        })

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  updateEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };
      console.log(loadedPost);

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    console.log('postData in Feed.js', postData);

    const formData = new FormData();
    // formData.append('title', postData.title);
    // formData.append('content', postData.content);
    // formData.append('public', postData.public);
    // if (!postData.image) {
    //   formData.append('image', postData.imageUrl);
    // } else {
    //   formData.append('image', postData.image);
    // }

    // formData.append('image', postData.image);

    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('public', postData.public);


    if (!postData.image || postData.image.length > 1 || postData.image.length === 1) {
      
      if (postData.image && postData.image.length > 0) {
        for (const file of postData.image) {
          formData.append('images', file)
        }
      }

      if (postData.embedUrl) {
        formData.append('embedUrl', postData.embedUrl)
      }

      if (this.state.editPost && postData.imagePaths.length > 0) {
        
        let totalFileNumber = 0;

        if (postData.image && postData.image !== 'undefined') {
          totalFileNumber = postData.image.length + postData.imagePaths.length;
        } else {
          totalFileNumber = postData.imagePaths.length;
        }
        console.log('totalFileNumber in Feed.js', totalFileNumber);
        formData.append('totalFileNumber', totalFileNumber);
      }
      // formData.append('images', postData.image);

      let url = BASE_URL + `/feed-images/post-images?userLocation=${localStorage.getItem('userLocation')}`;
      
      //// video post upload url
      if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'video') {
        url = BASE_URL + `/feed-video-upload?userLocation=${localStorage.getItem('userLocation')}`;
      }

      //// audio post upload url
      if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'audio') {
        url = BASE_URL + `/feed-audio-upload?userLocation=${localStorage.getItem('userLocation')}`;
      }


      let method = 'POST'

      if (this.state.editPost) {
        url = BASE_URL + '/feed-images/post-images/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
        method = 'put'

        //// video update upload url
        if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'video') {
          url = BASE_URL + '/feed-video-upload/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
        }

        //// audio update upload url
        if (postData.image && postData.image !== 'undefined' && postData.image[0].type.split('/')[0] === 'audio') {
          url = BASE_URL + '/feed-audio-upload/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
        }

              // console.log(postData.imagePaths);
        if (!postData.image && postData.imagePaths.length > 0) {
          const fileName = postData.imagePaths[0];
          const fileType = fileName.split('.').pop();
          // console.log('fileName, fileType', fileName, fileType);
          if (isAudioFile(fileType)) {
            url = BASE_URL + '/feed-audio-upload/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
            }
        }
      }

      // console.log(url, method);
      // throw new Error('error-error');






      axios.request({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
        onUploadProgress: (p) => {
          console.log('onUploadProgress', (p.loaded/p.total*100).toFixed(0), p); 
          this.setState({
              uploadProgress: p.loaded / p.total * 100
          });
        }
      })


      // fetch(url, {
      //   method: method,
      //   headers: {
      //     Authorization: 'Bearer ' + this.props.token,
      //   },
      //   body: formData,
      // })
      //   .then(res => {
      //     console.log(res);
      //     if (res.status !== 200 && res.status !== 201) {
      //       throw new Error('Creating or editing a post failed!');
      //     }
      //     return res.json();
      //   })


        .then(resData => {
          console.log(resData);

          // for fetch
          // const updatedPostData = resData.post;
          
          // for axios
          if (resData.status !== 200 && resData.status !== 201) {
            throw new Error('Creating or editing a post failed!');
          }
          const updatedPostData = resData.data.post;



          // console.log(updatedPostData);
  
          // console.log('this.state.editPost', this.state.editPost);
          
          if (this.state.editPost) {
            this.updatePost(updatedPostData);
          } else {
            this.addPost(updatedPostData);
          }

          // const post = {
          //   _id: resData.post._id,
          //   title: resData.post.title,
          //   content: resData.post.content,
          //   creator: resData.post.creator,
          //   createdAt: resData.post.createdAt,
          //   // b64Simage: b64smallImage,
          // };
          this.setState(prevState => {
            return {
              isEditing: false,
              editPost: null,
              editLoading: false,
              uploadProgress: 0,
            };
          }, () => {
            
            //// // delete selectedId, postData edit from single postpage
            const selectedPostId = localStorage.getItem('selectedPostId');
            if (selectedPostId) {
              localStorage.removeItem('selectedPostId');
              localStorage.removeItem('selectedPostData');
              this.props.history.push(`/feed/${selectedPostId}`);
            } else {
              // this.loadPosts();
            }
          })
  
          if (updatedPostData.public === 'public') {
            return postUpdatePushHandler(
              // BASE_URL,
              PUSH_URL,
              localStorage.getItem('token'),
              localStorage.getItem('userId'),
              updatedPostData
            )
          }
          
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          // this.catchError(err);  

          const errmessage = { message: 'Creating or editing a post failed!'}
          this.catchError(errmessage);

          this.setState({
            isEditing: false,
            editPost: null,
            editLoading: false,
            // error: err,
            error: errmessage,
            uploadProgress: 0,
          });

          //// // delete selectedId, postData edit from single postpage
          const selectedPostId = localStorage.getItem('selectedPostId');
          if (selectedPostId) {
            localStorage.removeItem('selectedPostId');
            localStorage.removeItem('selectedPostData');
            
            setTimeout(() => {
              this.props.history.push(`/feed/${selectedPostId}`);
            }, 1000*5);
          }
        });
    
    }


    // this.setState({
    //   editLoading: true
    // });
    // console.log(postData);

    // const formData = new FormData();
    // formData.append('title', postData.title);
    // formData.append('content', postData.content);
    // formData.append('public', postData.public);
    // if (postData.image === postData.imageUrl) {
    //   formData.append('image', postData.imageUrl);
    // } else {
    //   formData.append('image', postData.image);
    // }

    // // formData.append('b64Simage', b64smallImage);

    // console.log(formData);
    // let url = BASE_URL + `/feed/post?userLocation=${localStorage.getItem('userLocation')}`;
    // let method = 'POST'
    // if (this.state.editPost) {
    //   url = BASE_URL + '/feed/post/' + this.state.editPost._id + `?userLocation=${localStorage.getItem('userLocation')}`;
    //   method = 'put'
    // }

    // fetch(url, {
    //   method: method,
    //   body: formData,
    //   headers: {
    //     Authorization: 'Bearer ' + this.props.token
    //   }
    // })
    //   .then(res => {
    //     console.log(res);
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Creating or editing a post failed!');
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     console.log(resData);

    //     const updatedPostData = resData.post;
    //     // console.log(updatedPostData);

    //     // const post = {
    //     //   _id: resData.post._id,
    //     //   title: resData.post.title,
    //     //   content: resData.post.content,
    //     //   creator: resData.post.creator,
    //     //   createdAt: resData.post.createdAt,
    //     //   // b64Simage: b64smallImage,
    //     // };
    //     this.setState(prevState => {
    //       return {
    //         isEditing: false,
    //         editPost: null,
    //         editLoading: false
    //       };
    //     }, () => {
    //       this.loadPosts();
    //     })

    //     if (updatedPostData.public === 'public') {
    //       return postUpdatePushHandler(
    //         // BASE_URL,
    //         PUSH_URL,
    //         localStorage.getItem('token'),
    //         localStorage.getItem('userId'),
    //         updatedPostData
    //       )
    //     }
        
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.setState({
    //       isEditing: false,
    //       editPost: null,
    //       editLoading: false,
    //       error: err
    //     });
    //   });

  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch(BASE_URL + '/feed/post/' + postId, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch(err => {
        console.log(err);
        this.catchError(err);
        this.setState({ postsLoading: false });
      });
  };


  deleteMultiImagePostHandler = (postId, isVideo, isAudio) => {
    this.setState({ isPostDeleting: true });
    this.setState({ postDeleteResult: '' });

    const lsDeletePostId = localStorage.getItem('deletePostId');

    localStorage.removeItem('deletePostId');
    localStorage.removeItem('deletePostData');

    let url = BASE_URL + `/feed-images/post-images/${postId}?userLocation=${localStorage.getItem('userLocation')}`;
    
    if (isVideo) {
      url = BASE_URL + `/feed-video-upload/${postId}?userLocation=${localStorage.getItem('userLocation')}`;
    }

    if (isVideo) {
      url = BASE_URL + `/feed-video-upload/${postId}?userLocation=${localStorage.getItem('userLocation')}`;
    }

    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        //// load post when total post is less than perpage (to show pagination)
        if (this.state.totalPosts <= this.state.perPage + 1) {
          this.loadPosts();
        }

        this.setState({ isPostDeleting: false });

        this.setState({ postDeleteResult: 'Post delete success' });
        setTimeout(() => {
          this.setState({ postDeleteResult: '' });
        },1000*5);

        this.setState(prevState => {
          const updatedPosts = prevState.posts.filter(p => p._id !== postId);
          return { 
            posts: updatedPosts, 
            totalPosts: updatedPosts.length,
            postsLoading: false,
          };
        });

        deleteLsFavoritePost(postId);
        
        // return fetch(BASE_URL + '/feed/action', {
        //   method: 'GET',
        //   headers: {
        //     Authorization: 'Bearer ' + this.props.token,
        //   },
        // })

        if (lsDeletePostId) {
          this.setState({
            error: { message: 'Deleted' },
          });
  
          setTimeout(() => {
            this.setState({
              error: null,
            });
          },3000);
        }
        
      })
      // .then(res => {
      //   console.log(res);
      // })
      .catch(err => {
        console.log(err);
        this.setState({ isPostDeleting: false });

        this.setState({ postDeleteResult: 'Post delete failed' });
        setTimeout(() => {
          this.setState({ postDeleteResult: '' });
        },1000*5);

        if (lsDeletePostId) {
          const errmessage = { message: 'Deletion failed!'}
          this.catchError(errmessage);
  
          this.setState({
            error: errmessage,
          });
  
          setTimeout(() => {
            this.props.history.push(`/feed/${postId}`);
          }, 3000);
        }

      })
  };


  updatePostElementHandler = (updatedPostData) => {
    this.updatePost(updatedPostData);
  };





  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  deletePostImageHandler = postId => {
    this.setState({ postsLoading: true });

    return new Promise((resolve, reject) => {
      fetch(BASE_URL + '/feed/postimage/' + postId, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Deleting a post image failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
  
          if (resData.data.deletePostImage) {
            this.setState({ imageDeleted: true })
          }
          
          this.loadPosts();
          
          resolve(resData);
          // this.setState(prevState => {
          //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
          //   return { posts: updatedPosts, postsLoading: false };
          // });
        })
        .catch(err => {
          console.log(err);
          this.catchError(err);
          this.setState({ postsLoading: false });
        });
    })
  };

  imageDeletedHandler = (input) => {
    this.setState({ imageDeleted: input });
  };

  getStoreCurrentPage = (storeCurrentPage, posts) => {
    this.setState({ 
      postPage: storeCurrentPage,
      posts: posts
    });
  }

  render() {

    //// start edit direction from mainNavigation smallmodal
    if (localStorage.getItem('directStartEdit')) {
      this.newPostHandler();
      // localStorage.removeItem('directStartEdit');
    }
    localStorage.removeItem('directStartEdit');


    const { t } = this.props;

    // document.title=`watakura: ${t('title.text01', 'Store, Share Photos. Connect with People, Friends, Family by Talk & Group Talk')}`;

    // console.log('feedjs-props',this.props);
    const start = (this.state.postPage - 1) * this.state.perPage;

    let pagePosts;
    // const feedPost = (
    //   this.state.posts.slice(start, start + this.state.perPage).map(post => {
    //     const postElement = (
    //       <Post
    //         key={post._id}
    //         id={post._id}
    //         author={post.creatorName}
    //         creatorImageUrl={post.creatorImageUrl}
    //         date={new Date(post.createdAt).toLocaleDateString('en-US')}
    //         title={post.title}
    //         image={post.imageUrl}
    //         modifiedImageUrl={post.modifiedImageUrl}
    //         content={post.content}
    //         b64Simage={post.b64Simage}
    //         postCreator_id={post._id}
    //         public={post.public}
    //         onStartEdit={this.startEditPostHandler.bind(this, post._id)}
    //         onDelete={this.deletePostHandler.bind(this, post._id)}
    //       />
    //     );

    //     if (post.creatorId === localStorage.getItem('userId')) {
    //       return postElement;
    //     } else {
    //       if (post.public) {
    //         return postElement;
    //       }
    //     }
    //     return ''
    //   })
    // );
    
    let showPostNumber;
    let start2;
    start2 = (this.state.postPage - 1) * this.state.maxPagePostNumber;
    if (this.state.perPage + this.state.moreClickNum * this.state.perPage > this.state.maxPagePostNumber) {
      showPostNumber = this.state.maxPagePostNumber;
    } else {
      showPostNumber = this.state.perPage + this.state.moreClickNum * this.state.perPage;
    }
    console.log(start2, showPostNumber, this.state.searchPostPage, this.state.postPage);


    if (this.state.searchPosts.length > 0) {
      start2 = (this.state.searchPostPage - 1) * this.state.maxPagePostNumber;
      
      if (this.state.perPage + this.state.searchMoreClickNum * this.state.perPage > this.state.maxPagePostNumber) {
        showPostNumber = this.state.maxPagePostNumber;
      } else {
        showPostNumber = this.state.perPage + this.state.searchMoreClickNum * this.state.perPage;
      }
      console.log(start2, showPostNumber, this.state.searchPostPage, this.state.postPage);
    }


    // const lastPage = Math.ceil(this.state.totalPosts / this.state.perPage);
    // console.log('totalPost, postPage, perPage, lastPage', this.state.totalPosts, this.state.postPage, this.state.perPage, lastPage)
    
    let adIndexList = createWithAdIndexList();
    const topAdPlaceId = `feedPage-top-page-${this.state.postPage}`;
    const rightAdPlaceId = `feedPage-right-page-${this.state.postPage}`;



    let feedPost2 
    if (this.state.searchPosts.length > 0) {
      feedPost2 = (
        this.state.searchPosts.slice(start2, start2 + showPostNumber).map(post => {
          const postElement = (
            <Post
              key={post._id}
              id={post._id}
              author={post.creatorName}
              creatorImageUrl={post.creatorImageUrl}
              date={new Date(post.createdAt).toLocaleDateString('en-US')}
              postDate={post.createdAt}
              title={post.title}
              image={post.imageUrl}
              modifiedImageUrl={post.modifiedImageUrl}
              thumbnailImageUrl={post.thumbnailImageUrl}
              imageUrls={post.imageUrls}
              modifiedImageUrls={post.modifiedImageUrls}
              thumbnailImageUrls={post.thumbnailImageUrls}
              imagePaths={post.imagePaths}
              modifiedImagePaths={post.modifiedImagePaths}
              thumbnailImagePaths={post.thumbnailImagePaths}
              embedUrl={post.embedUrl}
              content={post.content}
              b64Simage={post.b64Simage}
              postCreatorUserId={post.creatorId}
              public={post.public}
              onStartEdit={this.startEditPostHandler.bind(this, post._id)}
              onDelete={this.deletePostHandler.bind(this, post._id)}
              // deleteMultiImagePostHandler={this.deleteMultiImagePostHandler.bind(this, post._id)}
              deleteMultiImagePostHandler={this.deleteMultiImagePostHandler}
              updatePostElementHandler={this.updatePostElementHandler}
              isPostDeleting={this.state.isPostDeleting}
              postDeleteResult={this.state.postDeleteResult}
              setSelectedCreatorId={this.setSelectedCreatorId}
              resetPostPage={this.resetPostPage}
              postData={post}
              postFilter={this.state.postFilter}
            />
          );
  
          if (post.creatorId === localStorage.getItem('userId')) {
            return postElement;
          } else {
            if (post.public) {
              return postElement;
            }
          }
          return ''
        })
      );

    } else { 
      feedPost2 = (
        this.state.posts.slice(start2, start2 + showPostNumber).map((post, index) => {
          // console.log('start2, showPostNumber, index', start2, showPostNumber, index);

          const pagePostNum = this.state.posts.slice(start2, start2 + showPostNumber).length;
          // console.log('adIndexList pagePostNum', adIndexList, pagePostNum);
          
          if (pagePostNum > 0 && pagePostNum < 5) {
            adIndexList = [pagePostNum - 1];
          }

          if (pagePostNum === 1) {
            adIndexList = [];
          }

          // const adIndexList = [2, 4];
          //// var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
          
          const isAdIndex = adIndexList.find(ix => {
            return ix === index;
          });
          const indexValue = isAdIndex && `page-${this.state.postPage}-${index}`;
          // console.log('withIndex', isAdIndex, index, indexValue, adIndexList);

          const postElement = (
            <Post
              key={post._id}
              id={post._id}
              author={post.creatorName}
              creatorImageUrl={post.creatorImageUrl}
              date={new Date(post.createdAt).toLocaleDateString('en-US')}
              postDate={post.createdAt}
              title={post.title}
              image={post.imageUrl}
              modifiedImageUrl={post.modifiedImageUrl}
              thumbnailImageUrl={post.thumbnailImageUrl}
              imageUrls={post.imageUrls}
              modifiedImageUrls={post.modifiedImageUrls}
              thumbnailImageUrls={post.thumbnailImageUrls}
              imagePaths={post.imagePaths}
              modifiedImagePaths={post.modifiedImagePaths}
              thumbnailImagePaths={post.thumbnailImagePaths}
              embedUrl={post.embedUrl}
              content={post.content}
              b64Simage={post.b64Simage}
              postCreatorUserId={post.creatorId}
              public={post.public}
              onStartEdit={this.startEditPostHandler.bind(this, post._id)}
              onDelete={this.deletePostHandler.bind(this, post._id)}
              // deleteMultiImagePostHandler={this.deleteMultiImagePostHandler.bind(this, post._id)}
              deleteMultiImagePostHandler={this.deleteMultiImagePostHandler}
              updatePostElementHandler={this.updatePostElementHandler}
              isPostDeleting={this.state.isPostDeleting}
              postDeleteResult={this.state.postDeleteResult}
              setSelectedCreatorId={this.setSelectedCreatorId}
              resetPostPage={this.resetPostPage}
              postData={post}
              postFilter={this.state.postFilter}
              withAdIndex={isAdIndex && indexValue}
            />
          );

          if (post.creatorId === localStorage.getItem('userId')) {
            return postElement;
          } else {
            if (post.public) {
              return postElement;
            }
          }
          return ''
        })
      );
    }




    if (!this.state.postsLoading && !this.state.userOnly) {
      console.log(this.state.posts);

      let favoriteButton;
      if (this.props.isAuth && this.state.isFavoritePosts) {
      //  favoriteButton = (
      //   <Button mode="flat" type="submit" onClick={this.favoritePostsClickHandler}>
      //     posts
      //     {t('general.text19')}
      //   </Button>
      //  );
      }
      if (this.props.isAuth && !this.state.isFavoritePosts) {
        // favoriteButton = (
        //   <Button mode="flat" type="submit" onClick={this.favoritePostsClickHandler}>
        //     favorite posts
        //     {t('general.text18')}
        //   </Button>
        // );
      }

      // console.log(this.state.postsLoading, this.state.userOnly)
      pagePosts = (
        <div>
          {/* <Paginator
            onPrevious={this.loadPosts.bind(this, 'previous')}
            onNext={this.loadPosts.bind(this, 'next')}
            lastPage={Math.ceil(this.state.totalPosts / this.state.perPage)}
            currentPage={this.state.postPage}
          >
            {feedPost}
          </Paginator> */}

          {/* {feedPost2} */}

          <div className="feed__favoriteButton">
            {favoriteButton}
          </div>

          {/* <AutoSuggestHook
              posts={this.state.posts}
              getSearchPosts={this.getSearchPosts}
              darkMode={this.props.darkMode}
              resetSearchPostPage={this.resetSearchPostPage}
              // maxSearchPostNumber={this.state.maxSearchPostNumber}
          /> */}
          
          
          {this.state.selectedCreatorId ? 
            <div>
              {this.state.selectedCreatorName}'s posts     
              {/* <Button mode="flat" type="submit" onClick={this.resetSelectedCreatorId}>
                back to posts
              </Button> */}
            </div>
          : null
          }


          {this.state.searchPosts.length > 0 ? 
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'searchPrevious')}
              onNext={this.loadPosts.bind(this, 'searchNext')}
              lastPage={Math.ceil(this.state.searchPosts.length / this.state.maxPagePostNumber)}
              currentPage={this.state.searchPostPage}
              getStoreCurrentPage={this.getStoreCurrentPage}
              posts={this.state.posts}
            >
              {feedPost2}
            </Paginator>
          :
          <Paginator
            onPrevious={this.loadPosts.bind(this, 'previous')}
            onNext={this.loadPosts.bind(this, 'next')}
            lastPage={Math.ceil(this.state.posts.length / this.state.maxPagePostNumber)}
            currentPage={this.state.postPage}
            getStoreCurrentPage={this.getStoreCurrentPage}
            posts={this.state.posts}
          >
            {feedPost2}
          </Paginator>
        }



          {/* {this.state.moreClickNum * this.state.perPage < this.state.posts.length ?
            <button onClick={this.morePostHandler}>show-more-post-button</button>          
            :null
          } */}
        </div> 
      );
    }
    else if (!this.state.postsLoading && this.state.userOnly) {
      // console.log(this.state.postsLoading, this.state.userOnly)
      const selectButtons = (
        <div className="feed__selectButtons">
          
          <Button mode="flat" type="submit" onClick={() => {
            this.setState({ userPageSelect: 'posts'});
            }}
          >
            {/* posts */}
            {t('general.text19')}
          </Button>
          <Button mode="flat" type="submit" onClick={() => {
            this.setState({ userPageSelect: 'images'})
            }}
          >
            {/* Images */}
            {t('general.text20')}
          </Button>
          <Button mode="flat" type="submit" onClick={() => {
            this.setState({ userPageSelect: 'videos'})
            }}
          >
            {/* Videos */}
            {t('general.text21')}
          </Button>

        </div>
      );

      if (this.state.userPageSelect === 'posts') {
        pagePosts = (
        <div>
          {selectButtons}
          {/* <Paginator
            onPrevious={this.loadPosts.bind(this, 'previous')}
            onNext={this.loadPosts.bind(this, 'next')}
            lastPage={Math.ceil(this.state.totalPosts / this.state.perPage)}
            currentPage={this.state.postPage}
          >
            {feedPost}
          </Paginator> */}

          {/* {feedPost2} */}

          <AutoSuggestHook
            posts={this.state.posts}
            getSearchPosts={this.getSearchPosts}
            // darkMode={this.props.darkMode}
            resetSearchPostPage={this.resetSearchPostPage}
            // maxSearchPostNumber={this.state.maxSearchPostNumber}
          />

          {this.state.searchPosts.length > 0 ? 
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'searchPrevious')}
              onNext={this.loadPosts.bind(this, 'searchNext')}
              lastPage={Math.ceil(this.state.searchPosts.length / this.state.maxPagePostNumber)}
              currentPage={this.state.searchPostPage}
              getStoreCurrentPage={this.getStoreCurrentPage}
              posts={this.state.posts}
            >
              {feedPost2}
            </Paginator>
          :
          <Paginator
            onPrevious={this.loadPosts.bind(this, 'previous')}
            onNext={this.loadPosts.bind(this, 'next')}
            lastPage={Math.ceil(this.state.posts.length / this.state.maxPagePostNumber)}
            currentPage={this.state.postPage}
            getStoreCurrentPage={this.getStoreCurrentPage}
            posts={this.state.posts}
          >
            {feedPost2}
          </Paginator>
        }



          {/* {this.state.moreClickNum * this.state.perPage < this.state.posts.length ?
            <button onClick={this.morePostHandler}>show-more-post-button</button>          
            :null
          } */}
        </div> 
      );

      }
      if (this.state.userPageSelect === 'images') {
        pagePosts = (
          <div>
            {selectButtons}
            <FeedImages 
              posts={this.state.posts} 
              fileType="images"
              maxPagePostNumber={this.state.maxPagePostNumber}
              perPage={this.state.perPage}
            />
          </div>
        );
      }

      if (this.state.userPageSelect === 'videos') {
        pagePosts = (
          <div>
            {selectButtons}
            <FeedImages 
              posts={this.state.posts} 
              fileType="videos"
              maxPagePostNumber={this.state.maxPagePostNumber}
              perPage={this.state.perPage}
            />          </div>
        );
      }
      // console.log(this.state.postsLoading, this.state.userOnly)

    }

    return (
      <Fragment>
        <div className="feed-container">
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />

        <GetWindowData 
          setWindowValues={(windowValues) => {
              this.setState({ windowValues: windowValues }, 
              // () => {console.log('windowvalues', this.state.windowValues)}
              );
          }}
        />

        {this.state.windowValues && (this.state.windowValues.width < 768) && (
          <AdElementDisplay 
            adType='300x65' 
            adPlaceId={topAdPlaceId}
          />
        )}
        
        {this.state.windowValues && (this.state.windowValues.width >= 768) && (
          <AdElementDisplay 
            adType='300x300' 
            adPlaceId={rightAdPlaceId}
          />
        )}


        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
          deletePostImageHandler={this.deletePostImageHandler}
          imageDeleted={this.state.imageDeleted}
          imageDeletedHandler={this.imageDeletedHandler}
          postsLoading={this.state.postsLoading}
          history={this.props.history}
        />

        {this.props.isAuth ?
          <div>
            {/* <section className="feed__status">
            <form onSubmit={this.statusUpdateHandler}>
              <Input
                type="text"
                placeholder="Your status"
                control="input"
                onChange={this.statusInputChangeHandler}
                value={this.state.status}
              />
              <Button mode="flat" type="submit">
                Update
              </Button>
            </form>
          </section> */}

            <section className="feed__control">
              <Button mode="raised" design="accent" onClick={this.newPostHandler}>
 
                {t('feed.text1', 'New Post')}
              </Button>
              <Button mode="raised" design="accent" onClick={() => {this.setState({ newLiveStart: !this.state.newLiveStart }); }}>
                {t('feed.text43', 'New Live broadcast')}
              </Button>
              {this.state.newLiveStart && (
                <StartNewLive 
                  onClose={() => { this.setState({ newLiveStart: false }); }}
                />
              )}
            </section>

            {/* <Button mode="flat" design="" onClick={() => {
                this.onlyUserHandler();
                this.resetSelectedCreatorId();
              }}
            >
              {this.state.userOnly ? 'Show Posts' : 'Show User Posts'}
              {this.state.userOnly ? t('feed.text3') : t('feed.text2')}
            </Button> */}

            {/* <AutoSuggestHook
              posts={this.state.posts}
              getSearchPosts={this.getSearchPosts}
              darkMode={this.props.darkMode}
              resetSearchPostPage={this.resetSearchPostPage}
              // maxSearchPostNumber={this.state.maxSearchPostNumber}
            /> */}

          </div>
          : null
        }


        <PostSelect
          showRecentPostsHandler={this.showRecentPostsHandler}
          showUserPostsHandler={this.showUserPostsHandler}
          showFavoritePostsHandler={this.showFavoritePostsHandler}
          showMostViewedPostsHandler={this.showMostViewedPostsHandler}
          showMostLikedPostsHandler={this.showMostLikedPostsHandler}
          showRecentVisitPostsHandler={this.showRecentVisitPostsHandler}
          isAuth={this.props.isAuth}
          history={this.props.history}
        />
     

        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}

          {pagePosts}

        </section>

        {/* <div>
          ImageUpload///
        <ImageUpload 
          token={this.props.token}
        />
        </div> */}

        <FeedSocketAction uploadProgress={this.state.uploadProgress} />
      </div>
      </Fragment>
    );
  }
}

export default withI18n()(Feed);
// export default Feed;
