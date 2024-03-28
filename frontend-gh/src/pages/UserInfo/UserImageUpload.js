import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';
import { withI18n } from "react-i18next";

import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import ImageUploadEdit from '../../components/ImageUploadEdit/ImageUploadEdit';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
// import { getUserData } from '../../util/user';
import './UserImageUpload.css';

import {
  BASE_URL,
  // GQL_URL 
} from '../../App';


class ImageUpload extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    // postsLoading: true,
    postsLoading: false,
    editLoading: false,
    userOnly: false,
    userPostPage: 1,
    perUserPostPage: 2,
    userPosts: [],
    perPage: 2,
    user: '',
    showDeleteModal: false,
    // imageUrl: '',
  };

  componentDidMount() {
    // console.log('Userimageupload props', this.props);

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
    })
  }

  newPostHandler = () => {
    this.setState({ isEditing: true });
  }

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };
      // console.log(loadedPost);

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  showDeleteModalHandler = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  finishUploadHandler = postData => {
    console.log('in finishupload handler');
    this.setState({
      editLoading: true
    });
    console.log(postData);

    const formData = new FormData();
    if (!postData.image) {
      formData.append('image', postData.imageUrl);
    } else {
      formData.append('image', postData.image);
    }

    console.log(formData);
    let url = BASE_URL + `/auth/image?userId=${localStorage.getItem('userId')}&userLocation=${localStorage.getItem('userLocation')}`;
    let method = 'POST'
    if (this.state.editPost) {
      url = BASE_URL + '/auth/image/' + this.state.editPost._id;
      method = 'put'
    }

    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a image failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
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
            editLoading: false
          };
        }, () => {
          // this.getImageHandler();
          this.props.getNewImageUrl(resData.data.imageUrl);
          this.props.hideImageUpdateButton();

          // console.log('finishedit handler')
        });

      })
      .catch(err => {
        console.log(err);
        this.catchError(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  }


  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };


  deleteImageHandler = userId => {
    this.setState({ postsLoading: true });
    fetch(BASE_URL + `/auth/image?userId=${userId}&userLocation=${localStorage.getItem('userLocation')}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a image failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          user: { imageUrl: null },
          showDeleteModal: false,
          postsLoading: false,
        })
        // this.getImageHandler();
        this.props.getNewImageUrl(null);
        this.props.hideImageUpdateButton();

        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch(err => {
        console.log(err);
        this.catchError(err);
        this.setState({
          postsLoading: false,
          showDeleteModal: false,
        });
        this.props.hideImageUpdateButton();
      });
  };

  getImageHandler = () => {
    return new Promise((resolve, reject) => {

      this.setState({ postsLoading: true });
      fetch(BASE_URL + '/auth/userdata', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Getting a image failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
          this.setState({
            user: resData.data
          },
            () => {
              resolve('Get Image Data.');
              // this.props.getNewImageUrl(resData.data.imageUrl);
              // this.props.hideImageUpdateButton();
            });
          // this.loadPosts();

          // this.setState(prevState => {
          //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
          //   return { posts: updatedPosts, postsLoading: false };
          // });
        })
        .catch(err => {
          console.log(err);
          this.catchError(err);
          this.setState({ postsLoading: false });
          // this.props.hideImageUpdateButton();
          reject('Get image failed.')
        });

      return Promise;
    })

  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    // console.log('Userimageupload-props', this.props);
    const { t } = this.props;

    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />

        <section className="userImageUpload__ButtonsContainer">
          <Button mode="flat" design="" onClick={this.newPostHandler}>
            {/* Upload Image */}
            {t('general.text7')}
          </Button>
          {this.props.userImageUrl ?
            <Button mode="flat" design="danger" onClick={this.showDeleteModalHandler}>
              {/* Delete Image */}
              {t('general.text8')}
            </Button>
            : null}
          {/* <Button mode="raised" design="accent" onClick={this.getImageHandler}>
            get-getImage
          </Button>
          <Button mode="raised" design="accent" onClick={() => {getUserData(GQL_URL, this.props.token)}}>
            get-getUserData
          </Button>
          <img src={BASE_URL + '/' + this.state.user.imageUrl} alt="" height="40"></img> */}

        </section>
        <ImageUploadEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishImageEdit={this.finishUploadHandler}
          user={this.state.user}
        />

        {this.state.showDeleteModal ?
          <div>
            <Modal
              // title=""
              acceptEnabled={this.props.userImageUrl}
              onCancelModal={this.showDeleteModalHandler}
              onAcceptModal={() => { this.deleteImageHandler(localStorage.getItem('userId')) }}
              isLoading={this.state.postsLoading}
              title="Image Deletion"
            // style="confirmModal"
            >
              <div className="userImageUpload__confirmContent">
                {/* Is is no problem to delete image completely? */}
                {t('userInfo.text5')}
            </div>
            </Modal>
          </div>
          : null}
      </Fragment>
    );
  }
}

// export default ImageUpload;
export default withI18n()(ImageUpload);