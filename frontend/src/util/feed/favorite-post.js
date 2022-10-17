export const deleteLsFavoritePost = (postId) => {
  const lsFavoritePosts = localStorage.getItem('userFavoritePosts');
  if (lsFavoritePosts) {
    const parsedList = JSON.parse(lsFavoritePosts);

    if (parsedList.userId === localStorage.getItem('userId')) {
      const deletedPosts = parsedList.posts.filter(post => {
        return post._id !== postId;
      });
  
      const newFavoritePosts = {
        ...parsedList,
        posts: deletedPosts,
      }
  
      localStorage.setItem('userFavoritePosts', JSON.stringify(newFavoritePosts));
    }
  }
};

export const addLsFavoritePost = (post, userId) => {
  const lsFavoritePosts = localStorage.getItem('userFavoritePosts');
  if (lsFavoritePosts) {
    const parsedList = JSON.parse(lsFavoritePosts);

    if (parsedList.userId === localStorage.getItem('userId')) {
      const addedPosts = [post].concat(parsedList.posts);

      const newFavoritePosts = {
        ...parsedList,
        posts: addedPosts,
      }
  
      localStorage.setItem('userFavoritePosts', JSON.stringify(newFavoritePosts));
    }
  } 
  if (!lsFavoritePosts && userId) {
    const newFavoritePosts = {
      posts: [post],
      userId: userId,
      getDate: 0,
    }

    localStorage.setItem('userFavoritePosts', JSON.stringify(newFavoritePosts));
  }
};

export const updateLsFavoritePosts = (updatePost) => {
  const lsFavoritePosts = localStorage.getItem('userFavoritePosts');
  if (lsFavoritePosts) {
    const parsedList = JSON.parse(lsFavoritePosts);

    if (parsedList.userId === localStorage.getItem('userId')) {
      const postIndex = parsedList.posts.findIndex(post => {
        return post._id === updatePost._id
      });

      if (postIndex > -1) {
        parsedList.posts[postIndex] = updatePost;
        localStorage.setItem('userFavoritePosts', JSON.stringify(parsedList));
      }
      
    }
  }
};