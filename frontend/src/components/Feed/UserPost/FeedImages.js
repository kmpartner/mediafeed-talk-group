import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next/hooks';
import Img from "react-cool-img";

import Button from '../../Button/Button';
// import Paginator from '../../components/Paginator/Paginator';
import AutoSuggestHook from '../../AutoSuggest/AutoSuggestHook';
import Paginator from '../../Paginator/Paginator';
import { BASE_URL } from '../../../App';

import classes from './FeedImages.module.css';
// import './Feed.css';

const FeedImages = props => {
  console.log('feedimages-props', props)
  // const { t, i18n } = useTranslation('translation');
  // const [t] = useTranslation('translation');
  // console.log(t);

  const showImagesNumber = props.perPage;
  const maxPageImageNumber = props.maxPagePostNumber;

  // const [showImages, setShowImages] = useState(true);
  const [moreUImageClickNum, setMoreUImageClickNum] = useState(0);
  const [imagePage, setImagePage] = useState(1);
  const [searchPosts, setSearchPosts] = useState([]);

  useEffect(() => {
    // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //   // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
    //   moreImageHandler();
    //   // console.log('in USEEFFECT');
    // }
    // window.onscroll = (ev) => {
    //   // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
    //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //     // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
    //     moreImageHandler();

    //   }
    // };
  }, [moreUImageClickNum]);




  // const showImagesHandler = () => {
  //   // setShowImages(!showImages);
  // }

  const moreImageHandler = () => {
    console.log(moreUImageClickNum * showImagesNumber, imagePostList.length);
    if (props.posts.length && moreUImageClickNum * showImagesNumber >= imagePostList.length) {
      return;
    } else {
      setMoreUImageClickNum(moreUImageClickNum + 1);
    }
  }

  const loadImages = direction => {
    if (direction) {
      // this.setState({ postsLoading: true, posts: [] });
    }
    let page = imagePage;

    if (direction === 'next') {
      page++;
      setImagePage(page);
    }
    if (direction === 'previous') {
      page--;
      setImagePage(page);
    }
  }

  const getSearchPosts = (posts) => {
    // console.log(posts);
    setSearchPosts(posts);
    // console.log(searchPosts);
  }

  const resetSearchPostPage = () => {
    setImagePage(1);
  }

  let imagePostList;
  if (props.fileType === 'images') {
    imagePostList = props.posts.filter(element => {
      // console.log(element.imageUrl, element.imagePath);

      // const type = element.imageUrl ? element.imageUrl.split('.').pop().toLowerCase() : null;
      const imagePlace = element.imageUrl ? element.imageUrl.split('?')[0] : null;
      const type = element.imageUrl ? imagePlace.split('.')[imagePlace.split('.').length - 1].toLowerCase() : null;
      
      // const type = element.imageUrl ? element.imageUrl.split('.').pop().toLowerCase() : null;
      return type === 'png' ||
        type === 'jpg' ||
        type === 'jpeg' ||
        type === 'webp'
    });
  }


  if (props.fileType ==='videos') {
    imagePostList = props.posts.filter(element => {
      // console.log(element.imageUrl, element.imagePath);
      
      // const type = element.imageUrl ? element.imageUrl.split('.').pop().toLowerCase() : null;
      const imagePlace = element.imageUrl ? element.imageUrl.split('?')[0] : null;
      const type = element.imageUrl ? imagePlace.split('.')[imagePlace.split('.').length - 1].toLowerCase() : null;

      return type === 'mp4' ||
        type === 'webm' 
    });
  }


  let imagesPostList;
  if (props.fileType === 'images') {
    imagesPostList = props.posts.filter(element => {

      const imagePath = element.imagePaths.length > 0 ? element.imagePaths[0] : null;
      const type = imagePath ? imagePath.split('.')[imagePath.split('.').length - 1].toLowerCase(): null;

      return type === 'png' ||
        type === 'jpg' ||
        type === 'jpeg' ||
        type === 'webp'
    });
  }

  if (props.fileType ==='videos') {
    imagesPostList = props.posts.filter(element => {
      // console.log(element.imageUrl, element.imagePath);
      
      const imagePath = element.imagePaths.length > 0 ? element.imagePaths[0] : null;
      const type = imagePath ? imagePath.split('.')[imagePath.split('.').length - 1].toLowerCase(): null;

      return type === 'mp4' ||
        type === 'webm' 
    });
  }

  console.log(imagePostList);
  console.log(imagesPostList);

  let showPageImageNumber;
  const start = (imagePage - 1) * maxPageImageNumber;
  const pageEnd = start + ((moreUImageClickNum + 1) * maxPageImageNumber);

  // if (showImagesNumber + moreUImageClickNum * showImagesNumber > maxPageImageNumber) {
  //   showPageImageNumber = maxPageImageNumber;
  // } else {
  //   showPageImageNumber = showImagesNumber + moreUImageClickNum * showImagesNumber;
  // }

  // console.log(start, showImagesNumber + moreUImageClickNum * showImagesNumber, showPageImageNumber);


  let postImages;

  if (searchPosts.length > 0) {
    postImages = (
      searchPosts.map(post => {
        // console.log('searchpost map', post);
        return (
          <div className="feedImages__column" key={post._id} >
            <Link className="feedImages__link" to={post._id}>
              {props.fileType === 'images' &&
                // <img src={post.imageUrl} height="200" maxwidth="" alt="not-img"></img>
                // <img src={post.modifiedImageUrl} height="100" maxwidth="" alt="no-img"></img>
                <Img src={post.modifiedImageUrl} height="100" maxwidth="" alt="no-img" />
              }
              {props.fileType === 'videos' &&
                // <img src={BASE_URL + '/' + post.thumbnailImageUrl} height="100" alt=""></img>
                // <img src={post.thumbnailImageUrl} height="100" alt=""></img>
                <Img src={post.thumbnailImageUrl} height="100" alt="no-img" />
              }
              {/* <div className="feedImages__postTitleEmp">title</div> */}
              <div className="feedImages__postTitle">
                {post.title.length < 20 ? post.title : post.title.slice(0, 20) + '...'}
              </div>
              {/* <div className="feedImages__postTitle">{post.title.length < 10 ? post.title : post.title.slice(0, 10) + '..'}</div> */}
            
              <div className="feedImages__postCreateDate">
                {`${post.createdAt.split('-')[0]}/${post.createdAt.split('-')[1]}`}
              </div>
            </Link>
          </div>
        );
      })
    );

  } else {
    postImages = (
      // imagePostList.slice(0, (showImagesNumber + showImagesNumber * moreUImageClickNum)).map(post => {
      // imagePostList.slice(start, start + showPageImageNumber).map(post => {
      imagePostList.slice(start, pageEnd).map(post => {
        console.log('start, end', start, pageEnd);
        return (
          <div className="feedImages__column" key={post._id} >
            <Link className="feedImages__link" to={post._id}>
              {props.fileType === 'images' &&
                // <img src={post.imageUrl} height="200" maxwidth="" alt="not-img"></img>
                // <img src={post.modifiedImageUrl} height="100" maxwidth="" alt="no-img"></img>
                <Img src={post.modifiedImageUrl} height="100" maxwidth="" alt="no-img" />
              }
              {props.fileType === 'videos' &&
                // <img src={BASE_URL + '/' + post.thumbnailImageUrl} height="100" alt=""></img>
                // <img src={post.thumbnailImageUrl} height="100" alt="no-img"></img>
                <Img src={post.thumbnailImageUrl} height="100" alt="no-img" />
              }
              {/* <div className="feedImages__postTitleEmp">title</div> */}
              <div className="feedImages__postTitle">
                {post.title.length < 20 ? post.title : post.title.slice(0, 20) + '...'}
              </div>
              {/* <div className="feedImages__postTitle">{post.title.length < 10 ? post.title : post.title.slice(0, 10) + '..'}</div> */}

              <div className="feedImages__postCreateDate">
                {`${post.createdAt.split('-')[0]}/${post.createdAt.split('-')[1]}`}
              </div>
            </Link>
          </div>

        );
      })
    );
  }


  let imagesPostImages;

  if (searchPosts.length > 0) {
    imagesPostImages = (
      searchPosts.map(post => {
        // console.log('searchpost map', post);
        if (post.modifiedImageUrls.length > 0) {
          return (
            <div className="feedImages__column" key={post._id} >
              <Link className="feedImages__link" to={post._id}>
                {props.fileType === 'images' &&
                  <span className={classes.feedImagesImage}>
                    <Img src={post.modifiedImageUrls[0]} height="100" maxwidth="" alt="no-img" />
                    <div className={classes.feedImagesImageNumber}>
                      {post.modifiedImageUrls.length}
                    </div>
                  </span>
                }
                {props.fileType === 'videos' &&
                  // <img src={BASE_URL + '/' + post.thumbnailImageUrl} height="100" alt=""></img>
                  // <img src={post.thumbnailImageUrl} height="100" alt="no-img"></img>
                  <Img src={post.thumbnailImageUrls[0]} height="100" alt="no-img" />
                }
                {/* <div className="feedImages__postTitleEmp">title</div> */}
                <div className="feedImages__postTitle">
                  {post.title.length < 20 ? post.title : post.title.slice(0, 20) + '...'}
                </div>
                {/* <div className="feedImages__postTitle">{post.title.length < 10 ? post.title : post.title.slice(0, 10) + '..'}</div> */}
    
                <div className="feedImages__postCreateDate">
                  {`${post.createdAt.split('-')[0]}/${post.createdAt.split('-')[1]}`}
                </div>
              </Link>
            </div>
          );
        }
        else {
          return null;
        }
      })
    );

  }
  else {
    imagesPostImages = (
      // imagePostList.slice(0, (showImagesNumber + showImagesNumber * moreUImageClickNum)).map(post => {
      // imagePostList.slice(start, start + showPageImageNumber).map(post => {
      imagesPostList.slice(start, pageEnd).map(post => {
        console.log('start, end', start, pageEnd);
        return (
          <div className="feedImages__column" key={post._id} >
            <Link className="feedImages__link" to={post._id}>
              {props.fileType === 'images' &&
                <span className={classes.feedImagesImage}>
                  <Img src={post.modifiedImageUrls[0]} height="100" maxwidth="" alt="no-img" />
                  <div className={classes.feedImagesImageNumber}>
                    {post.modifiedImageUrls.length}
                  </div>
                </span>
              }
              {props.fileType === 'videos' &&
                // <img src={BASE_URL + '/' + post.thumbnailImageUrl} height="100" alt=""></img>
                // <img src={post.thumbnailImageUrl} height="100" alt="no-img"></img>
                <Img src={post.thumbnailImageUrls[0]} height="100" alt="no-img" />
              }
              {/* <div className="feedImages__postTitleEmp">title</div> */}
              <div className="feedImages__postTitle">
                {post.title.length < 20 ? post.title : post.title.slice(0, 20) + '...'}
              </div>
              {/* <div className="feedImages__postTitle">{post.title.length < 10 ? post.title : post.title.slice(0, 10) + '..'}</div> */}
  
              <div className="feedImages__postCreateDate">
                {`${post.createdAt.split('-')[0]}/${post.createdAt.split('-')[1]}`}
              </div>
            </Link>
          </div>
  
        );
      })
    );
  }


  let showMoreButton;
  if (moreUImageClickNum * showImagesNumber < imagePostList.length) {
    showMoreButton = (
      <button onClick={moreImageHandler}>show-more-img</button>
    )
  }

  return (
    <div>
      {/* feedimages Component 20 */}

      {/* <button onClick={showImagesHandler}>Images 20</button>
      <Button mode="flat" design="" onClick={showImagesHandler}>
                Images
              </Button> */}
      <div>
        <div>
          {/* Recent Image Post */}
          </div>
        <div className="feedImages__row">

          <AutoSuggestHook
            posts={imagesPostList.concat(imagePostList)}
            getSearchPosts={getSearchPosts}
            resetSearchPostPage={resetSearchPostPage}
          />

          
          {imagesPostImages}

          {/* {postImages} */}

          {/* {postImages} */}
        </div>
      </div>

      {/* {showMoreButton} */}

      <Paginator
            onPrevious={loadImages.bind(this, 'previous')}
            onNext={loadImages.bind(this, 'next')}
            lastPage={Math.ceil(imagePostList.length / maxPageImageNumber)}
            currentPage={imagePage}
          >
            {/* {postImages} */}
      </Paginator>
    </div>
  );
}

export default FeedImages;