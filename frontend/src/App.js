import React, { Component, Fragment, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { withI18n } from "react-i18next";
import { I18nextProvider } from 'react-i18next';
import jwt from 'jsonwebtoken';

import i18n from './i18n';

import Button from './components/Button/Button';
import Layout from './components/Layout/Layout';
import LivePost from './pages/Live/LivePost';
import Loader from './components/Loader/Loader';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import UserActions from './pages/Auth/UserActions';
import SignupPage from './pages/Auth/Signup';
// import ImageUpload from './pages/ImageUpload/ImageUpload';
import TermsOfUse from './pages/Terms/TermsOfUse';
import PrivacyPolicy from './pages/Terms/PrivacyPolicy';
import UserInfo from './pages/UserInfo/UserInfo';
// import NeedToLogin from './pages/NeedToLogin/NeedToLogin';
import NotPageFound from './pages/NotPageFound/NotPageFound';
import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';
import AppStorage from './util/appStorage';
import AuthCheck from './components/Auth/AuthCheck';
import { updateEmailVerified, updateUserInfo, getAuthInfo, getUserData } from './util/user';
import { putBrowserHistory } from './util/history';

import VideoTextTalk from './pages/VideoTextTalk/VideoTextTalk';
import GroupTalk from './pages/GroupTalk/GroupTalk';

import GetAd from './components/GroupTalk/GroupAdElements/GetAds/GetAds';
import GetWindowData from './components/UI/getWindowData';

import './App.css';

// import * as firebase from "firebase/app";

// // Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_PROJECTID + ".firebaseapp.com",
  databaseURL: "https://" + process.env.REACT_APP_FIREBASE_PROJECTID + ".firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_PROJECTID + ".appspot.com",
  messagingSenderId: "327377228340",
  appId: "1:327377228340:web:b9e2ff48f5d5c02bb13061",
  measurementId: "G-6BYDDFRPNX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//// dev urls
export const BASE_URL = process.env.REACT_APP_DEV_BASE_URL;
export const GQL_URL = process.env.REACT_APP_DEV_GQL_URL;
export const SOCKET_URL = process.env.REACT_APP_DEV_SOCKET_URL;
export const SOCKET_GROUP_URL = process.env.REACT_APP_DEV_SOCKET_GROUP_URL;
export const SOCKET_SURL = process.env.REACT_APP_DEV_SOCKET_SURL;
export const SOCKET_GROUP_SURL = process.env.REACT_APP_DEV_SOCKET_GROUP_SURL;
export const PUSH_URL = process.env.REACT_APP_DEV_PUSH_URL;
export const authPageLink = process.env.REACT_APP_DEV_AUTHPAGE_URL + `/login?fromUrl=${encodeURIComponent(window.location.origin)}`;
export const authSignupPageLink = process.env.REACT_APP_DEV_AUTHPAGE_URL + `/signup?fromUrl=${encodeURIComponent(window.location.origin)}`;
export const ADNETWORK_URL = process.env.REACT_APP_DEV_BASE_URL;

//// test-deploy urls (use canary services in backend)  
//// Don't Forget update servicewoker file for build
// export const BASE_URL = process.env.REACT_APP_TEST_BASE_URL;
// export const GQL_URL = process.env.REACT_APP_TEST_GQL_URL;
// export const SOCKET_URL = process.env.REACT_APP_TEST_SOCKET_URL;
// export const SOCKET_GROUP_URL = process.env.REACT_APP_TEST_SOCKET_GROUP_URL;
// export const SOCKET_SURL = process.env.REACT_APP_TEST_SOCKET_SURL;
// export const SOCKET_GROUP_SURL = process.env.REACT_APP_TEST_SOCKET_GROUP_SURL;
// export const PUSH_URL = process.env.REACT_APP_TEST_PUSH_URL;
// export const authPageLink = process.env.REACT_APP_AUTHPAGE_URL + `/login?fromUrl=${encodeURIComponent(window.location.origin)}`;
// export const authSignupPageLink = process.env.REACT_APP_AUTHPAGE_URL + `/signup?fromUrl=${encodeURIComponent(window.location.origin)}`;
// export const ADNETWORK_URL = process.env.REACT_APP_TEST_BASE_URL;

//// do urls deploy  Don't Forget update servicewoker file for build
// export const BASE_URL = process.env.REACT_APP_BASE_URL;
// export const GQL_URL = process.env.REACT_APP_GQL_URL;
// export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
// export const SOCKET_GROUP_URL = process.env.REACT_APP_SOCKET_GROUP_URL;
// export const SOCKET_SURL = process.env.REACT_APP_SOCKET_SURL;
// export const SOCKET_GROUP_SURL = process.env.REACT_APP_SOCKET_GROUP_SURL;
// export const PUSH_URL = process.env.REACT_APP_PUSH_URL;
// export const authPageLink = process.env.REACT_APP_AUTHPAGE_URL + `/login?fromUrl=${encodeURIComponent(window.location.origin)}`;
// export const authSignupPageLink = process.env.REACT_APP_AUTHPAGE_URL + `/signup?fromUrl=${encodeURIComponent(window.location.origin)}`;
// export const ADNETWORK_URL = process.env.REACT_APP_BASE_URL;




// export let BASE_URL;
// export let GQL_URL;
// if (process.env.NODE_ENV === 'production') {
//   BASE_URL = process.env.REACT_APP_BASE_URL;
//   GQL_URL = process.env.REACT_APP_GQL_URL;
// } else {
//   BASE_URL = process.env.REACT_APP_DEV_BASE_URL;
//   GQL_URL = process.env.REACT_APP_DEV_GQL_URL;
// }

  //// PWA-cource

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      // .register('/sw.js')
      .then(() => {
        console.log('Service-worker registered!');
      }).catch((err) => {

        console.log('service-worker register error', err);
      });
  }

  //// end of PWA-course


  const aps = new AppStorage();
  console.log('appStorage', aps);


class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
    name: '',
    imageUrl: '',
    isEmailVerified: false,
    sendVerifyMailMessage: '',
    firebaseUser: '',
    userUpdateAction: 0,
    darkMode: false
  };

  componentDidMount() {
    console.log('app.js-props', this.props);
    // this.getAuthInfo();

    getAuthInfo()
      .then(result => {
        console.log(result);

        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        if (!token || !expiryDate) {
          return;
        }
        if (new Date(expiryDate) <= new Date()) {
          this.logoutHandler();
          return;
        }
        const userId = localStorage.getItem('userId');
        const name = localStorage.getItem('name');
        const remainingMilliseconds =
          new Date(expiryDate).getTime() - new Date().getTime();
        this.setState({
          isAuth: true,
          token: token,
          userId: userId,
          name: name,
        });
        this.setAutoLogout(remainingMilliseconds);
    
        //firebase user
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            // User is signed in.
            console.log('fb user', user);
            this.setState({
              firebaseUser: user
            })
          } else {
            // User is signed out.
            console.log('no fb user')
          }
        });
    
        // this.props.history.push('/');

      })
      .catch(err => {
        console.log(err);

        this.logoutHandler();
        
        err.message = 'Login failed ...';

        this.setState({
            // isAuth: false,
            authLoading: false,
            error: err
        });
      })


    this.props.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`,
        location
      );
      console.log(`The last navigation action was ${action}`);
    });


    
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt fired in app');
      // event.preventDefault();
      // deferredPrompt = event;
      // return false;
    });

    // console.log(navigator.userAgent);
    // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //   document.write("mobile");
    // }else{
    //   document.write("not mobile...");
    // }

    
    //// set language if user selected language in localStorage
    const lsUserSelectLng = localStorage.getItem('userSelectLng');
    if (lsUserSelectLng) {
      // console.log(lsUserSelectLng);
      i18n.changeLanguage(lsUserSelectLng);
    }

  }

  // getAuthInfo = () => {
  //   const currentUrl = new URL(window.location.href);
  //   const queryParams = currentUrl.searchParams;
  //   // console.log(currentUrl);
  
  //   if (queryParams.get('tokenForCasTGT') || queryParams.get('casTGT')) {

  //     const token = queryParams.get('tokenForCasTGT');
  
  //     localStorage.setItem('tokenForCasTGT', token);
  //     localStorage.setItem('casTGT', queryParams.get('casTGT'));
  //     localStorage.setItem('TGTexp', queryParams.get('TGTexp'));
  //     // localStorage.setItem('casUserId', queryParams.get('casUserId'));
  
  //     const jwtdecoded = jwt.decode(token);
  //     console.log(jwtdecoded);

  //     const userId = jwtdecoded.userId;
  //     const email = jwtdecoded.email;
  //     const name = jwtdecoded.name;
  //     localStorage.setItem('token', token);
  //     localStorage.setItem('userId', userId);
  //     localStorage.setItem('name', name);
  
  //     // const expiryDate = new Date(resData.exp * 1000);
  //     const tokenExpire = new Date(Number(localStorage.getItem('TGTexp')) * 1000);
  //     localStorage.setItem('expiryDate', tokenExpire);
      
  //     updateUserInfo(
  //       BASE_URL, 
  //       token,
  //       userId, 
  //       email,
  //       name
  //     ).then(result => {
  //       console.log(result);

  //       localStorage.setItem('name', result.data.name);

  //       localStorage.removeItem('casTGT');
  //       localStorage.removeItem('tokenForCasTGT');
  //       localStorage.removeItem('TGTexp');
    
  //       // const dummyError = {
  //       //   message: 'dummy-error'
  //       // }
  //       // this.setState({
  //       //   isAuth: false,
  //       //   authLoading: false,
  //       //   error: dummyError
  //       // });

  //       // this.props.history.push('/feed/posts');
  //       // window.location.replace(window.location.origin + '/feed/posts');
  //     })
  //     .catch(err => {
  //       console.log(err);

  //       localStorage.removeItem('token', token);
  //       localStorage.removeItem('userId', userId);
  //       localStorage.removeItem('name', name);

  //       localStorage.removeItem('casTGT');
  //       localStorage.removeItem('tokenForCasTGT');
  //       localStorage.removeItem('TGTexp');

  //     })

  //   }
  // }

  mobileNavHandler = isOpen => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  userInfoAction = (userObj) => {
    this.setState({
      name: userObj.name,
      userUpdateAction: this.state.userUpdateAction + 1,
    });
    localStorage.setItem('name', userObj.name);
  }

  setDarkMode = (darkModeInput) => {
    this.setState({ darkMode: darkModeInput },
      () => console.log(this.state.darkMode))
  }

  logoutHandler = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log('fb logouted');
    }).catch(function (error) {
      // An error happened.
      console.log('fb logout failed');
    });

    this.setState({ isAuth: false, token: null, name: '' });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('userLocation');

    localStorage.removeItem('casTGT');
    localStorage.removeItem('tokenForCasTGT');
    localStorage.removeItem('TGTexp');
    this.props.history.push('/');
    window.location.reload();
  };

  logoutHandler2 = () => {

    this.setState({ isAuth: false, token: null, name: '' });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('userLocation');

    localStorage.removeItem('casTGT');
    localStorage.removeItem('tokenForCasTGT');
    localStorage.removeItem('TGTexp');
    this.props.history.push('/');
    // window.location.reload();
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    //// firebase login then mongo
    let fbUserInfo;

    firebase.auth().signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);



        fbUserInfo = res.user;
        console.log(fbUserInfo);
        this.setState({ isEmailVerified: fbUserInfo.emailVerified });
        
        if (!fbUserInfo.emailVerified) {
          // alert('not email verfied')
          throw new Error('not_email_verify');
        }



        ////login to mongo
        return fetch(BASE_URL + '/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: authData.email,
            password: authData.password
          })
        })
          .then(res => {
            if (res.status === 422) {
              // throw new Error('Validation failed.');
              throw new Error(
                // "Validation failed. Make sure the email address isn't used yet!"
                i18n.t('auth.text11')
              );
            }
            if (res.status !== 200 && res.status !== 201) {
              console.log('Error!');
              // throw new Error('Could not authenticate you!');
              // throw new Error('User login failed!')
              throw new Error(i18n.t('auth.text12'));
            }
            return res.json();
          })
          .then(resData => {
            console.log(resData);
            this.setState({
              isAuth: true,
              token: resData.token,
              authLoading: false,
              userId: resData.userId,
              name: resData.name,
              imageUrl: resData.imageUrl
            });

            // console.log(new Date(resData.exp * 1000));
            localStorage.setItem('token', resData.token);
            localStorage.setItem('userId', resData.userId);
            localStorage.setItem('name', resData.name);

            // const remainingMilliseconds = 60 * 60 * 1000 * 24;
            // const expiryDate = new Date(
            //   new Date().getTime() + remainingMilliseconds
            // );
            const remainingMilliseconds = resData.exp * 1000 - new Date().getTime()
            const expiryDate = new Date(resData.exp * 1000);
            // console.log(expiryDate, resData.exp * 1000, new Date().getTime(), remainingMilliseconds);

            localStorage.setItem('expiryDate', expiryDate.toISOString());
            this.setAutoLogout(remainingMilliseconds);

            // this.props.history.replace('/');
            this.props.history.push('/feed/posts');

            const emailVerifyState = fbUserInfo.emailVerified ? 'verified' : ''
            return updateEmailVerified(emailVerifyState, fbUserInfo.uid, BASE_URL, localStorage.getItem('token'))
          })
          .then(result => {
            console.log(result);
          })
        // .catch(err => {
        //   console.log(err);
        //   this.setState({
        //     isAuth: false,
        //     authLoading: false,
        //     error: err
        //   });
        // });

      })
      .catch((err) => {
        // Handle Errors here.
        console.log(err);
        // console.log(err.message);
        if (err.message === 'not_email_verify') {
          err.message = (
            <div>
              <div>
                {/* Email Verification is required to Login. Please send Email for verification to your Email address. */}
                {i18n.t('auth.text32')}
              </div>
              <Button design="raised" type="submit" onClick={this.fbSendVerificationEmail}>
                {/* Send Email for verification */}
                {i18n.t('auth.text33')}
              </Button>
              {/* <div>
                {this.state.sendVerifyMailMessage}
              </div> */}
            </div>
          );
        }

        // var errorCode = error.code;
        // var errorMessage = error.message;
        if (err.code === 'auth/wrong-password') {
          // err.message = 'Invalid Password was Entered'
          err.message = i18n.t('auth.text13');
        }
        if (err.code === 'auth/user-not-found') {
          // err.message = 'Entered email address was not found'
          err.message = i18n.t('auth.text14');
        }
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    //// fb siginup then mongo
    firebase.auth().createUserWithEmailAndPassword(
      authData.signupForm.email.value, authData.signupForm.password.value
    )
      .then(res => {
        console.log(res);

        //// mongo signup
        return fetch(BASE_URL + '/auth/signup', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: authData.signupForm.email.value,
            password: authData.signupForm.password.value,
            name: authData.signupForm.name.value
          })
        })
          .then(res => {
            if (res.status === 422) {
              throw new Error(
                // "Validation failed. Make sure the email address isn't used yet!"
                i18n.t('auth.text11')
              );
            }
            if (res.status !== 200 && res.status !== 201) {
              console.log('Error!');
              // throw new Error('Creating a user failed!');
              // throw new Error('User creation failed!');
              throw new Error(i18n.t('auth.text15'));
            }
            return res.json();
          })
          .then(resData => {
            console.log(resData);

            var user = firebase.auth().currentUser;
            firebase.auth().useDeviceLanguage();
            
            user.sendEmailVerification().then(() => {
              // Email sent.
              this.setState({
                // sendVerifyMailMessage: 'Verification Mail was sent. Plese check your email and verify. (also chack in spam mail)',
                sendVerifyMailMessage: i18n.t('auth.text31'),
                isAuth: false, 
                authLoading: false
              });
            }).catch((err) => {
              // An error happened.
              console.log(err);
              this.setState({
                isAuth: false,
                authLoading: false,
                error: err
              });
            });

            // this.setState({ isAuth: false, authLoading: false });
            // this.props.history.replace('/');
          })
        // .catch(err => {
        //   console.log(err);
        //   this.setState({
        //     isAuth: false,
        //     authLoading: false,
        //     error: err
        //   });
        // });

      })
      .catch((err) => {
        // Handle Errors here.
        console.log(err);
        if (err.code === 'auth/email-already-in-use') {
          // err.message = 'The email address is already in use by another account.';
          err.message = i18n.t('auth.text16');
        }

        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // ...
      });
  };

  setAutoLogout = milliseconds => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  fbSendVerificationEmail = () => {
    // set error message for display in error modal
    const loadingMessage = (<Loader />);
    this.setState({
      error: {
        message: loadingMessage
      }
    });

    var user = firebase.auth().currentUser;
    firebase.auth().useDeviceLanguage();
    
    user.sendEmailVerification()
    .then(() => {
      // Email sent.
      console.log('verification email send');

      this.setState({
        sendVerifyMailMessage: "Verification Mail was sent. Plese check your email and verify (also chack in spam mail).",
        isAuth: false, 
        authLoading: false,
      });

      //// throw error, just for display in error modal
      throw new Error('Verification_Mail_was_sent');
      
      // firebase.auth().signOut().then(function() {
      //     // Sign-out successful.
      //     console.log('signout success');
      //   }).catch(function(error) {
      //     // An error happened.
      //     console.log('signout failed');
      //   });

    })
    .catch((err) => {
      // An error happened.
      console.log(err);
      // console.log('verification mail send failed');

      if (err.message === 'Verification_Mail_was_sent') {
        // err.message = 'Verification Mail was sent. Plese check your email and verify (also chack in spam mail).'
        err.message = i18n.t('auth.text31');
      }

      this.setState({
        isAuth: false,
        authLoading: false,
        error: err
      });
    });
  }

  // ResetPasswordHandler = () => {
  //   console.log('in reset passwordHandler');
  // }

  // getNewPasswordTokenUser = () => {

  // }

  errorHandler = () => {
    this.setState({ error: null });
  };

  render() {
    let routes = (
      <Switch>
        <Route
            path="/talk-page"
            exact
            render={props => (
              <VideoTextTalk {...props} onLogin={this.loginHandler} loading={this.state.authLoading} isAuth={this.state.isAuth} />
            )}
        />
        <Route
            path="/group-talk-page"
            exact
            render={props => (
              <GroupTalk {...props} onLogin={this.loginHandler} loading={this.state.authLoading} isAuth={this.state.isAuth} />
            )}
        />
        {/* <Route
            path="/userinfo"
            exact
            render={props => (
              <UserInfo
                {...props}
                userId={this.state.userId}
                token={this.state.token}
                isAuth={this.state.isAuth}
                userInfoAction={this.userInfoAction}
              />
            )}
        /> */}
        {/* <Route
          path="/login"
          exact
          render={props => (
            <LoginPage {...props} onLogin={this.loginHandler} loading={this.state.authLoading} />
          )}
        />
        <Route
          path="/signup"
          exact
          render={props => (
            <SignupPage
              {...props}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
              sendVerifyMailMessage={this.state.sendVerifyMailMessage}
            />
          )}
        />
        <Route
          path="/useractions"
          // exact
          render={props => (
            <UserActions
              {...props}
              // onSignup={this.signupHandler}
              // getNewPasswordTokenUser={this.getNewPasswordTokenUser}
              // onResetPassword={this.ResetPasswordHandler}
              loading={this.state.authLoading}
            />
          )}
        /> */}
        {/* <Route
              path="/userinfo"
              exact
              render={props => (
                <UserInfo userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
              )}
        /> */}
        <Route
          path="/feed/posts"
          exact
          render={props => (
            <FeedPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
          )}
        />
        <Route
            path="/feed/userposts/:userId"
            // exact
            render={props => (
              <FeedPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} darkMode={this.state.darkMode}/>
            )}
        />
        <Route
          path="/feed/:postId"
          render={props => (
            <SinglePostPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
          )}
        />
        <Route
            path="/termsofuse"
            render={props => (
              <TermsOfUse {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
            )}
          />
        <Route
          path="/privacypolicy"
          render={props => (
            <PrivacyPolicy {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
          )}
        />
        <Route
          path="/livepost"
          render={props => (
            <LivePost {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
          )}
        />
        {/* <Route
          path="/"
          exact
          render={props => (
            <LoginPage {...props} onLogin={this.loginHandler} loading={this.state.authLoading} />
            // <FeedPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
            // <Redirect to="/feed/posts" />
          )}
        /> */}
        <Route
          path="/"
          // exact
          render={props => (
            <NotPageFound {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
          )}
        />
        {/* <Redirect to="/login" /> */}
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/talk-page"
            exact
            render={props => (
              <VideoTextTalk {...props} onLogin={this.loginHandler} loading={this.state.authLoading} isAuth={this.state.isAuth} />
            )}
          />
        <Route
            path="/group-talk-page"
            exact
            render={props => (
              <GroupTalk {...props} onLogin={this.loginHandler} loading={this.state.authLoading} isAuth={this.state.isAuth} />
            )}
        />
          <Route
            path="/userinfo"
            exact
            render={props => (
              <UserInfo
                {...props}
                userId={this.state.userId}
                token={this.state.token}
                isAuth={this.state.isAuth}
                userInfoAction={this.userInfoAction}
              />
            )}
          />
          <Route
            path="/feed/posts"
            exact
            render={props => (
              <FeedPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} darkMode={this.state.darkMode}/>
            )}
          />
          <Route
            path="/feed/userposts/:userId"
            // exact
            render={props => (
              <FeedPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} darkMode={this.state.darkMode}/>
            )}
          />
          <Route
            path="/feed/:postId"
            render={props => (
              <SinglePostPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
            )}
          />
          <Route
            path="/termsofuse"
            render={props => (
              <TermsOfUse {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
            )}
          />
          <Route
            path="/privacypolicy"
            render={props => (
              <PrivacyPolicy {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
            )}
          />
        <Route
          path="/livepost"
          render={props => (
            <LivePost {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
          )}
        />
          {/* <Route
            path="/"
            exact
            render={props => (
              // <FeedPage {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
              <Redirect to="/feed/posts" />
            )}
          /> */}
          <Route
            path="/"
            // exact
            render={props => (
              <NotPageFound {...props} userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
              // <FeedPage userId={this.state.userId} token={this.state.token} isAuth={this.state.isAuth} />
            )}
          />
          {/* <Redirect to="/feed/post/" /> */}
        </Switch>
      );
    }
    return (
      <Fragment>

        <Suspense fallback={null}>
          <I18nextProvider i18n={i18n}>

            {this.state.showBackdrop && (
              <Backdrop onClick={this.backdropClickHandler} />
            )}
            <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
            <Layout
              header={
                <Toolbar>
                  <MainNavigation
                    onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                    onLogout={this.logoutHandler}
                    isAuth={this.state.isAuth}
                    token={this.state.token}
                    name={this.state.name}
                    userUpdateAction={this.state.userUpdateAction}
                    history={this.props.history}
                  />
                </Toolbar>
              }
              mobileNav={
                <MobileNavigation
                  open={this.state.showMobileNav}
                  mobile
                  onChooseItem={this.mobileNavHandler.bind(this, false)}
                  onLogout={this.logoutHandler}
                  isAuth={this.state.isAuth}
                  token={this.state.token}
                  name={this.state.name}
                  userUpdateAction={this.state.userUpdateAction}
                />
              }
            />
            <div className="AppStretch AppContainer"> 


            
            {/* <a href={authPageLink}>auth-link-button</a>
            <br/>
            <a href={authSignupPageLink}>auth-signup-link-button</a> */}



              <div>
                {routes}
              </div>

                <div style={{display: 'none'}}>
                  <DarkModeToggle 
                    setDarkMode={this.setDarkMode}
                />
                
                <AuthCheck 
                  isAuth={this.state.isAuth}
                  logoutHandler2={this.logoutHandler2}
                />

                <GetAd />
                <GetWindowData 
                  setWindowValues={() => {}}
                />
                
                </div>
                  <div></div>
                  <div>-</div>

            </div>
            
            {/* <button onClick={this.fbSendVerificationEmail}>verification-test</button> */}

          </I18nextProvider>
        </Suspense>

      </Fragment>
    );
  }
}

export default withI18n()(withRouter(App));
