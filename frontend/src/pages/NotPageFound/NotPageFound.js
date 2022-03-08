import React from 'react';
import { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next/hooks';

import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { useStore } from '../../hook-store/store';
import { getUserDataForStore } from '../../util/user';

import AdElementDisplay from '../../components/GroupTalk/GroupAdElements/AdElememtDisplay/AdElementDisplay';

import { authPageLink, authSignupPageLink, BASE_URL } from '../../App';
import './NotPageFound.css';


import TalkIcon from '../../images/icons/talkIcon-white-48.png';
import FeedIcon from '../../images/icons/feedIcon-white-48.png';
import GroupIcon from '../../images/icons/groupIcon-white-48.png';
import LoginIcon from '../../images/icons/loginIcon-white-48.png';
import SignupIcon from '../../images/icons/signupIcon-white-48.png';

const NotPageFound = props => {
  // console.log('need-to-login-props', props);
  const [t] = useTranslation('translation');

  const [store, dispatch] = useStore();

  // console.log('store in NotPageFound.js', store);

  useEffect(() => {
    window.scrollTo(0, 0);

    document.title=`ud-gqlrest-api-front NotPageFound.js: ${t('title.text01', 'Share Photos and Store Photos. Connect with People, Friends, Family by Talk & Group Talk')}`;
  }, []);

  useEffect(() => {
    if (props.isAuth) {
      getUserDataForStore(BASE_URL, localStorage.getItem('token'))
      .then(result => {
        console.log(result);
  
        dispatch('SET_USERDATA', result.userData);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }, [props.isAuth]);

  console.log(props.history);
  console.log(document.referrer);
  // const containAuthPage = document.referrer.includes('http://localhost:8501');
  
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.searchParams;
  // console.log(currentUrl);

  if (!queryParams.get('tokenForCasTGT') && !queryParams.get('casTGT')) {
    // props.history.push('/feed/posts');
  }

  if (props.isAuth) {
    // props.history.push('/feed/posts');
  }


  const authForTestHandler = (url, userId) => {
    fetch(url + `/auth/auth-for-test`, {
      method: 'POST',
      headers: {
        // Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userId: userId,
        })
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("auth-for-test failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        props.history.push(
          window.location.host + `/?tokenForCasTGT=${resData.token}&casTGT=${localStorage.getItem('casTGT')}&TGTexp=${resData.TGTexp.toString()}`
          // window.location.host + `/?tokenForCasTGT=${resData.token}&casTGT=${resData.token}&TGTexp=${resData.TGTexp.toString()}`
        );
        window.location.reload();
        // resolve({ message: 'Update user color success', data: resData.data });
      })
      .catch(err => {
        console.log(err);
        // reject({ message: 'Update user color failed', error: err });
      });
  };

  const logoutForTestHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('userLocation');

    localStorage.removeItem('casTGT');
    localStorage.removeItem('tokenForCasTGT');
    localStorage.removeItem('TGTexp');
    props.history.push('/');
    window.location.reload();
  };




  let body;
  if (props.isLoading) {
    body = (<div className="notPageFound__Loader">
      <Loader />
      </div>);
  } 
  if (queryParams.get('tokenForCasTGT') && !props.isAuth) {
    body = (<div className="notPageFound__Loader">
      <Loader />
    </div>);
  }
  else {
    body = ( 
    <div className="notPageFound__container">
      {props.isAuth ?
          <div>
            <div className="notPageFound__textLink">
              {/* Where do you go today? */}
              {t('notFound.text4')}
            </div>
            {/* <Link to="/feed/posts">
              go to feed page
              {t('notFound.text2')}
            </Link> */}

          <div className="notPageFound__pageButton">
            <Link to="/feed/posts" className="notPageFound__linkButton">
              <Button
                    mode="raised" type="submit" design="success"
                    // disabled={!props.replyInput || props.commentLoading}
              >
                <span className="notPageFound__ButtonNameContainer">
                  <img className="notPageFound__Icon" src={FeedIcon} alt='icon'/> 
                  <span>Feed Page</span>
                </span>
              </Button>
            </Link>
          </div>

          <div className="notPageFound__pageButton">
            <Link to="/talk-page" className="notPageFound__linkButton">
              <Button
                    mode="raised" type="submit" design="success"
                    // disabled={!props.replyInput || props.commentLoading}
              >
                <span className="notPageFound__ButtonNameContainer">
                  <img className="notPageFound__Icon" src={TalkIcon} alt='icon'/>  
                  <span>Talk Page</span>
                </span>
              </Button>
            </Link>
          </div>

          <div className="notPageFound__pageButton">
            <Link to="/group-talk-page" className="notPageFound__linkButton">
              <Button
                    mode="raised" type="submit" design="success"
                    // disabled={!props.replyInput || props.commentLoading}
              >
                <span className="notPageFound__ButtonNameContainer">
                  <img className="notPageFound__Icon" src={GroupIcon} alt='icon'/> 
                  <span>Group Page</span>
                </span>
              </Button>
            </Link>
          </div>
            {/* <Redirect to="/feed/posts" /> */}
          </div>
        :
          <div className="notPageFound">
            <div className="notPageFound__linkButtonContainer">
              <a className="notPageFound__linkButton" href={authPageLink} >
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  {/* Login */}
                  {/* {t('general.text11')} */}

                  <span className="notPageFound__ButtonNameContainer">
                  <img className="notPageFound__Icon" src={LoginIcon} alt='icon'/> 
                  <span>{t('general.text11')}</span>
                </span>

                </Button>
              </a>

              <a className="notPageFound__linkButton" href={authSignupPageLink} >
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  {/* Signup */}
                  {/* {t('general.text12')} */}

                  <span className="notPageFound__ButtonNameContainer">
                  <img className="notPageFound__Icon" src={SignupIcon} alt='icon'/> 
                  <span>{t('general.text12')}</span>
                  </span>
                </Button>
              </a>
            </div>

            <div className="notPageFound__pageButton">
              <Link to="/feed/posts" className="notPageFound__linkButton">
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  <span className="notPageFound__ButtonNameContainer">
                    <img className="notPageFound__Icon" src={FeedIcon} alt='icon'/> 
                    <span>Feed Page</span>
                  </span>
                </Button>
              </Link>
            </div>

            <div className="notPageFound__pageButton">
              <Link to="/group-talk-page" className="notPageFound__linkButton">
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  <span className="notPageFound__ButtonNameContainer">
                    <img className="notPageFound__Icon" src={GroupIcon} alt='icon'/> 
                    <span>Group Page</span>
                  </span>
                </Button>
              </Link>
            </div>

            <div className="notPageFound__pageButton">
              <Link to="/talk-page" className="notPageFound__linkButton">
                <Button
                      mode="raised" type="submit" design="success"
                      // disabled={!props.replyInput || props.commentLoading}
                >
                  <span className="notPageFound__ButtonNameContainer">
                    <img className="notPageFound__Icon" src={TalkIcon} alt='icon'/>  
                    <span>Talk Page</span>
                  </span>
                </Button>
              </Link>
            </div>
            {/* <Redirect to="/login" /> */}
        </div>
      }
    </div>
    );
  }

  return (
    <div>
      
      <AdElementDisplay
        adType='300x65' 
        adPlaceId='toppage-top' 
      />
      <AdElementDisplay 
        adType='300x300'
        adPlaceId='toppage-right' 
      />



      {body}
      

      <div>
      
      <div>
        use this button for test login
      </div>
      {/* <input/> */}
      {/* select id for diffrent user */}
      {/* '61b41d950c71d544c5c32485', '60dfe34f948acf20fc03acde', '61b41d950c71d544c5c32496' */}
      </div>   
      <button onClick={() => {authForTestHandler(BASE_URL, '61b41d950c71d544c5c32485')}}>auth-for-test-button</button>
      <button onClick={logoutForTestHandler}>logout-for-test-button</button> 
    </div>
  );
}

export default NotPageFound;

// import React from 'react';
// import { useEffect } from 'react';
// import { Link, Redirect } from 'react-router-dom';
// import { useTranslation } from 'react-i18next/hooks';

// import Button from '../../components/Button/Button';
// import Loader from '../../components/Loader/Loader';
// import { useStore } from '../../hook-store/store';
// import { getUserDataForStore } from '../../util/user';

// import GroupRightElements from '../../components/GroupTalk/GroupAdElements/GroupRightElements/GroupRightElements';
// import GroupTopElements from '../../components/GroupTalk/GroupAdElements/GroupTopElements/GroupTopElements';

// import { authPageLink, authSignupPageLink, BASE_URL } from '../../App';
// import './NotPageFound.css';


// import TalkIcon from '../../images/icons/talkIcon-white-48.png';
// import FeedIcon from '../../images/icons/feedIcon-white-48.png';
// import GroupIcon from '../../images/icons/groupIcon-white-48.png';
// import LoginIcon from '../../images/icons/loginIcon-white-48.png';
// import SignupIcon from '../../images/icons/signupIcon-white-48.png';

// const NotPageFound = props => {
//   // console.log('need-to-login-props', props);
//   const [t] = useTranslation('translation');

//   const [store, dispatch] = useStore();
//   // console.log('store in NotPageFound.js', store);

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     document.title=`watakura: ${t('title.text01', 'Share Photos and Store Photos. Connect with People, Friends, Family by Talk & Group Talk')}`;
//   }, []);

//   useEffect(() => {
//     if (props.isAuth) {
//       getUserDataForStore(BASE_URL, localStorage.getItem('token'))
//       .then(result => {
//         console.log(result);
  
//         dispatch('SET_USERDATA', result.userData);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//     }
//   }, [props.isAuth]);

//   console.log(props.history);
//   console.log(document.referrer);
//   // const containAuthPage = document.referrer.includes('http://localhost:8501');
  
//   const currentUrl = new URL(window.location.href);
//   const queryParams = currentUrl.searchParams;
//   // console.log(currentUrl);

//   if (!queryParams.get('tokenForCasTGT') && !queryParams.get('casTGT')) {
//     // props.history.push('/feed/posts');
//   }

//   if (props.isAuth) {
//     // props.history.push('/feed/posts');
//   }

//   let body;
//   if (props.isLoading) {
//     body = (<div className="notPageFound__Loader">
//       <Loader />
//       </div>);
//   } 
//   if (queryParams.get('tokenForCasTGT') && !props.isAuth) {
//     body = (<div className="notPageFound__Loader">
//       <Loader />
//     </div>);
//   }
//   else {
//     body = ( 
//     <div className="notPageFound__container">
//       <GroupTopElements />
//       <GroupRightElements />
      
//       {props.isAuth ?
//           <div>
//             <div className="notPageFound__textLink">
//               {/* Where do you go today? */}
//               {t('notFound.text4')}
//             </div>
//             {/* <Link to="/feed/posts">
//               go to feed page
//               {t('notFound.text2')}
//             </Link> */}

//           <div className="notPageFound__pageButton">
//             <Link to="/feed/posts" className="notPageFound__linkButton">
//               <Button
//                     mode="raised" type="submit" design="success"
//                     // disabled={!props.replyInput || props.commentLoading}
//               >
//                 <span className="notPageFound__ButtonNameContainer">
//                   <img className="notPageFound__Icon" src={FeedIcon} alt='icon'/> 
//                   <span>Feed Page</span>
//                 </span>
//               </Button>
//             </Link>
//           </div>

//           <div className="notPageFound__pageButton">
//             <Link to="/talk-page" className="notPageFound__linkButton">
//               <Button
//                     mode="raised" type="submit" design="success"
//                     // disabled={!props.replyInput || props.commentLoading}
//               >
//                 <span className="notPageFound__ButtonNameContainer">
//                   <img className="notPageFound__Icon" src={TalkIcon} alt='icon'/>  
//                   <span>Talk Page</span>
//                 </span>
//               </Button>
//             </Link>
//           </div>

//           <div className="notPageFound__pageButton">
//             <Link to="/group-talk-page" className="notPageFound__linkButton">
//               <Button
//                     mode="raised" type="submit" design="success"
//                     // disabled={!props.replyInput || props.commentLoading}
//               >
//                 <span className="notPageFound__ButtonNameContainer">
//                   <img className="notPageFound__Icon" src={GroupIcon} alt='icon'/> 
//                   <span>Group Page</span>
//                 </span>
//               </Button>
//             </Link>
//           </div>
//             {/* <Redirect to="/feed/posts" /> */}
//           </div>
//         :
//           <div className="notPageFound">
//             <div className="notPageFound__linkButtonContainer">
//               <a className="notPageFound__linkButton" href={authPageLink} >
//                 <Button
//                       mode="raised" type="submit" design="success"
//                       // disabled={!props.replyInput || props.commentLoading}
//                 >
//                   {/* Login */}
//                   {/* {t('general.text11')} */}

//                   <span className="notPageFound__ButtonNameContainer">
//                   <img className="notPageFound__Icon" src={LoginIcon} alt='icon'/> 
//                   <span>{t('general.text11')}</span>
//                 </span>

//                 </Button>
//               </a>

//               <a className="notPageFound__linkButton" href={authSignupPageLink} >
//                 <Button
//                       mode="raised" type="submit" design="success"
//                       // disabled={!props.replyInput || props.commentLoading}
//                 >
//                   {/* Signup */}
//                   {/* {t('general.text12')} */}

//                   <span className="notPageFound__ButtonNameContainer">
//                   <img className="notPageFound__Icon" src={SignupIcon} alt='icon'/> 
//                   <span>{t('general.text12')}</span>
//                   </span>
//                 </Button>
//               </a>
//             </div>

//             <div className="notPageFound__pageButton">
//               <Link to="/feed/posts" className="notPageFound__linkButton">
//                 <Button
//                       mode="raised" type="submit" design="success"
//                       // disabled={!props.replyInput || props.commentLoading}
//                 >
//                   <span className="notPageFound__ButtonNameContainer">
//                     <img className="notPageFound__Icon" src={FeedIcon} alt='icon'/> 
//                     <span>Feed Page</span>
//                   </span>
//                 </Button>
//               </Link>
//             </div>

//             <div className="notPageFound__pageButton">
//               <Link to="/group-talk-page" className="notPageFound__linkButton">
//                 <Button
//                       mode="raised" type="submit" design="success"
//                       // disabled={!props.replyInput || props.commentLoading}
//                 >
//                   <span className="notPageFound__ButtonNameContainer">
//                     <img className="notPageFound__Icon" src={GroupIcon} alt='icon'/> 
//                     <span>Group Page</span>
//                   </span>
//                 </Button>
//               </Link>
//             </div>

//             <div className="notPageFound__pageButton">
//               <Link to="/talk-page" className="notPageFound__linkButton">
//                 <Button
//                       mode="raised" type="submit" design="success"
//                       // disabled={!props.replyInput || props.commentLoading}
//                 >
//                   <span className="notPageFound__ButtonNameContainer">
//                     <img className="notPageFound__Icon" src={TalkIcon} alt='icon'/>  
//                     <span>Talk Page</span>
//                   </span>
//                 </Button>
//               </Link>
//             </div>
//             {/* <Redirect to="/login" /> */}
//         </div>
//       }
//     </div>
//     );
//   }

//   return (
//     <div>
//       {body}
//     </div>
//   );
// }

// export default NotPageFound;