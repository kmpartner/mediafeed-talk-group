import React, { Component, Fragment } from 'react';
import i18n from '../../i18n';

import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';
import FilePicker from '../Form/Input/FilePicker';
import { required, acceptableUserImageFile } from '../../util/validators';
import { generateBase64FromImage, isImageFile } from '../../util/image';
import { BASE_URL } from '../../App';
import './ImageUploadEdit.css';

const POST_FORM = {

  image: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, acceptableUserImageFile]
  },
  imageUrl: {
    value: '',
    valid: true,
    touched: false,
    validators: []
  }
};

class ImageUploadEdit extends Component {
  
  state = {
    postForm: POST_FORM,
    formIsValid: false,
    imagePreview: null,
    publicValue: '',
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log('imageuploadEdit-props', this.props)
    // console.log(this.props.user.imageUrl);
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedPost !== this.props.selectedPost
    ) {
      const postForm = {
        image: {
          ...prevState.postForm.image,
          value: this.props.selectedPost.imagePath,
          valid: true
        },
        imageUrl: {
          ...prevState.postForm.imageUrl,
          value: this.props.user.imageUrl,
          valid: true,
        }
      };
      this.setState({ postForm: postForm, formIsValid: true });
    }
  }
  
  publicChangeHandler = (event) => {
    console.log(event.target);
    this.setState({
      publicValue : event.target.value
    }, () => {
      this.postInputChangeHandler('public', this.state.publicValue);
    });
  }

  postInputChangeHandler = (input, value, files) => {
    console.log(input, value, files);
    console.log(this.state.postForm)
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          // console.log(b64);
          this.setState({ imagePreview: b64 });
        })
        .catch(e => {
          this.setState({ imagePreview: null });
        });
    }
    this.setState(prevState => {
      console.log(prevState);
      let isValid = true;
      for (const validator of prevState.postForm[input].validators) {
        // console.log(validator);
        // console.log(value);
        isValid = isValid && validator(value);
      }
      // console.log(prevState.postForm);
      const updatedForm = {
        ...prevState.postForm,
        [input]: {
          ...prevState.postForm[input],
          valid: isValid,
          value: files ? files[0] : value
        },
        // public: {
        //   ...prevState.postForm['public'],
        //   value: this.state.publicValue
        // }
      };
      console.log(updatedForm);
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        postForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        postForm: {
          ...prevState.postForm,
          [input]: {
            ...prevState.postForm[input],
            touched: true
          }
        }
      };
    });
  };

  cancelPostChangeHandler = () => {
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
      imagePreview: null,
    });
    this.props.onCancelEdit();
  };

  acceptPostChangeHandler = () => {
    const post = {
      // title: this.state.postForm.title.value,
      image: this.state.postForm.image.value,
      imageUrl: this.state.postForm.imageUrl.value,
      // content: this.state.postForm.content.value,
      // public: this.state.postForm.public.value,
    };
    this.props.onFinishImageEdit(post);
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
      imagePreview: null
    });
  };

  render() {

    let imagePreviewBody;
    if (this.state.imagePreview) {
      if (this.state.imagePreview.split('/')[0] === 'data:image') {
        imagePreviewBody = (
          <div>
            <img src={this.state.imagePreview} height="50" alt=""></img>
          </div>);
      }
      // if (this.state.imagePreview.split('/')[0] !== 'data:image') {
      //   imagePreviewBody = (
      //     <div>
      //       <video src={this.state.imagePreview} height="100" controls></video>
      //     </div>);
      // }
    } else {
      let selectedImageType;
      if (this.props.selectedPost) {
        selectedImageType = this.props.selectedPost.modifiedImageUrl.split('.').pop();
        console.log(selectedImageType);

        if (isImageFile(selectedImageType)) {
          imagePreviewBody = (
            <div>
                <img src={BASE_URL + '/' + this.props.selectedPost.imageUrl} height="100" alt=""></img>
            </div>
          );
        }
        // if ( 
        //     selectedImageType === 'mp4' ||
        //     selectedImageType === 'webm'
        //   ) {
        //   imagePreviewBody = (
        //     <div>
        //         <video src={BASE_URL + '/' + this.props.selectedPost.imageUrl} height="100" controls></video>
        //     </div>
        //   );
        // }
      }

    }


    

    // {this.state.imagePreview ? (
    //   <div>
    //     {this.state.imagePreview.split('/')[0] === 'data:image'
    //       ? <img src={this.state.imagePreview} height="100" alt=""></img>
    //       : <video src={this.state.imagePreview} height="100" controls></video>
    //     }
    //   {/* <Image imageUrl={this.state.imagePreview} contain left /> */}
    //   </div>
    //   ) 
    // : 
    //   (
    //     <div>
    //       {this.props.selectedPost && this.state.imagePreview.split('/')[0] === 'data:image' ? 
    //         <img src={BASE_URL + '/' + this.props.selectedPost.modifiedImageUrl}></img>
    //         : null
    //       }
    //     </div>
    //   )
    // }

    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPostChangeHandler} />
        <Modal
          title=""
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPostChangeHandler}
          onAcceptModal={this.acceptPostChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            {/* <Input
              id="title"
              label="Title"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'title')}
              valid={this.state.postForm['title'].valid}
              touched={this.state.postForm['title'].touched}
              value={this.state.postForm['title'].value}
            /> */}
            <FilePicker
              id="image"
              label="Image"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'image')}
              valid={this.state.postForm['image'].valid}
              touched={this.state.postForm['image'].touched}
              usedIn="ImageUploadEdit"
            />

            <span className="imageUploadEdit__aboutImageFile">
              {/* (Image file should be jpg, jpeg, or png file, and less than 1MB) */}
              ({i18n.t('userInfo.text7')})
            </span>

            <div className="new-post__preview-image">
              {/* {!this.state.imagePreview && <p>Please choose an image.</p>} */}
              {imagePreviewBody}
            </div>
            {/* <Input
              id="content"
              label="Content"
              control="textarea"
              rows="2"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'content')}
              valid={this.state.postForm['content'].valid}
              touched={this.state.postForm['content'].touched}
              value={this.state.postForm['content'].value}
            /> */}
            {/* <div>
              <input type="radio" id="huey" name="drone" value="public"
                onChange={this.publicChangeHandler}
                // checked  
              />
              <label for="huey">public</label>
              <input type="radio" id="huey" name="drone" value="private"
                onChange={this.publicChangeHandler}
              />
              <label for="huey">private</label>
            </div> */}

          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default ImageUploadEdit;
