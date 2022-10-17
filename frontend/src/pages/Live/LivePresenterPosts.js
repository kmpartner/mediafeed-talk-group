import React from 'react';
import { useEffect, useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../components/Button/Button';
// import Feed from '../Feed/Feed';
import Loader from '../../components/Loader/Loader';
import Paginator from '../../components/Paginator/Paginator';
import Post from '../../components/Feed/Post/Post';

import { useStore } from '../../hook-store/store';


// import './NotPageFound.css';

import classes from './LivePost.module.css';

const perPagePost = 20;


const LivePresenterPosts = props => {

  const { presenterPosts } = props;

  const [t] = useTranslation('translation');

  const [currentPage, setCurrentPage] = useState(1);

  // const [store, dispatch] = useStore();

  const pageStart = (currentPage -1) * perPagePost;
  const pageEnd = currentPage * perPagePost;

  let presenterPostsBody;

  if (presenterPosts.length > 0) {
    presenterPostsBody = (
      <ul>{presenterPosts.slice(pageStart, pageEnd).map(post => {
        return (
          <div key={post._id} className="feed-container">
            {/* {post.title} */}
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
              onStartEdit={() => {}}
              onDelete={() => {}}
              // deleteMultiImagePostHandler={this.deleteMultiImagePostHandler.bind(this, post._id)}
              deleteMultiImagePostHandler={() => {}}
              updatePostElementHandler={() => {}}
              isPostDeleting={''}
              postDeleteResult={''}
              setSelectedCreatorId={''}
              resetPostPage={''}
              postData={post}
              postFilter={''}
            />
          </div>
        );
      })}</ul>
    );
  }



  return (
    <Fragment>
          <Paginator
            onPrevious={() => { setCurrentPage(currentPage - 1); }}
            onNext={() => { setCurrentPage(currentPage + 1); }}
            lastPage={Math.ceil(presenterPosts.length / perPagePost)}
            currentPage={currentPage}
            getStoreCurrentPage={() => {}}
            posts={presenterPosts}
            noScroll={'no-scroll'}
          >
            {presenterPostsBody}
          </Paginator>
    </Fragment>
  );
}

export default LivePresenterPosts;
