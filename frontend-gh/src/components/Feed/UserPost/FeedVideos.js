// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// import { BASE_URL } from '../../../App';
// // import './Feed.css';

// const FeedVideos = props => {
//   console.log('FeedVideos-props', props);
//   const [ showVideos, setShowVideos ] = useState(false);
  
//   const showVideosNumber = 10;
  
//   const showVideosHandler = () => {
//     setShowVideos(!showVideos);
//   }

//   const videoPostList = props.posts.filter(element => {
//     // const type = element.imagePath ? element.imagePath.split('.').pop().toLowerCase() : null;
//     const type = element.imageUrl ? element.imageUrl.split('.').pop().toLowerCase() : null;
//     // const type = element.imageUrl.split('.').pop().toLowerCase();
//     return type === 'mp4' || type === 'webm' 
//   });
//   console.log(videoPostList);

//   const postVideos = (
//     videoPostList.slice(0, showVideosNumber).map(post => {
//       return (
//         <div className="feedImages__column" key={post._id} >
//           <Link className="feedImages__link" to={post._id}>
//             {/* <video src={BASE_URL + '/' + post.imageUrl} height="150"></video> */}
//             <img src={BASE_URL + '/' + post.thumbnailImageUrl} height="100" alt=""></img>
//             <div>{post.title}</div>
//           </Link>
//         </div>
//       );
//     })
//   );

//   return (
//     <div>
//       {/* feedvideos component 10 */}
//       vtot:{videoPostList.length}
//       <button onClick={showVideosHandler}>Videos 10</button>
      
//       <div className="feedImages__row">
//         {showVideos ? postVideos : null}
//       </div>
//     </div>
//   );
// }

// export default FeedVideos;