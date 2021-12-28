import React, { Component } from 'react';
import { withI18n } from "react-i18next";
import i18n from '../../i18n';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { required, length, email, validComplexPassword } from '../../util/validators';
import { getNewPasswordTokenUser, resetPassword } from '../../util/user'
import Auth from './Auth';
import { BASE_URL } from '../../App';

import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";


let queryEmail;
if (window.location.search) {
  queryEmail = window.location.search.split('&').pop();
}
const actionMode = window.location.search.split('&')[0];
// console.log(actionMode);

class UserActions extends Component {
  state = {
    signupForm: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 8 })]
      },
      name: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
      },
      formIsValid: false,
      enoughPassword: false,
      isUserWithResetToken: false,
      passwordToken: '',
      isLoading: false,
      resetMessage: '',
      emailVerifyMessage: ''
    }
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    console.log(window.location, queryEmail);

    getNewPasswordTokenUser(BASE_URL, queryEmail.split('=')[1])
      .then(result => {
        console.log(result);
        this.setState({ 
          isUserWithResetToken : true,
          passwordToken: result.data.resetToken,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });

      if (actionMode === '?mode=verifyEmail') {
        this.emailVerificationHandler();
      }
  }

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.signupForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        signupForm: updatedForm,
        formIsValid: formIsValid
      };
    }, () => {
      if (this.passwordValidity(this.state.signupForm.password.value)) {
        this.setState({ enoughPassword: true })
      } else {
        this.setState({ enoughPassword: false })
      }
      // console.log(this.state.loginForm.password.value.length);
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        signupForm: {
          ...prevState.signupForm,
          [input]: {
            ...prevState.signupForm[input],
            touched: true
          }
        }
      };
    });
  };

  
  passwordValidity = (input) => {
    // console.log(event.target.value);
    console.log(this.state);
    console.log(validComplexPassword(input));
    return validComplexPassword(input);
  }

  passwordResetHandler = () => {
    this.setState({ isLoading: true });

    let queryOobCode;
    if (window.location.search) {
      queryOobCode = window.location.search.split('&')[1].split('=')[1];
    }

    resetPassword(
      BASE_URL, 
      queryEmail.split('=')[1],
      this.state.signupForm['password'].value,
      this.state.passwordToken,
      queryOobCode
    )
    .then(result => {
      console.log(result);
      this.setState({ 
        isLoading: false,
        // resetMessage: 'Password reset success',
        resetMessage: i18n.t('auth.text21'),
        signupForm: {
          password: {
            value: ''
          } 
        }
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({ 
        isLoading: false,
        // resetMessage: 'Password reset failed, Please go to Login page and send email for password reset again', 
        resetMessage: i18n.t('auth.text22'),
        signupForm: {
          password: {
            value: ''
          } 
        }
      });
    });

  }

  emailVerificationHandler = () => {
    this.setState({ isLoading: true });

    const queryOobCode = window.location.search.split('&')[1].split('=')[1];
    console.log(queryOobCode);

    firebase.auth().applyActionCode(queryOobCode)
    .then((resp) => {
      console.log(resp);
      this.setState({
        // emailVerifyMessage: 'Email verification success, please go to login page shown above',
        emailVerifyMessage: i18n.t('auth.text29'),
        isLoading: false
      })
      // Email address has been verified.
  
      // TODO: Display a confirmation message to the user.
      // You could also provide the user with a link back to the app.
  
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    }).catch((err) => {
      // Code is invalid or expired. Ask the user to verify their email address
      // again.
      console.log(err);
      this.setState({
        // emailVerifyMessage: 'Email verification failed. This page is expired, or verification is already finished.',
        emailVerifyMessage: i18n.t('auth.text30'),
        isLoading: false
      })
      // 'he action code is invalid. This can happen if the code is malformed, expired, or has already been used.'
    });
  }

  render() {
    // console.log('signup props', this.props);
    const { t } = this.props;

    let body;
    if (this.state.isLoading) {
      body = (
        <div className="auth-form__loader">
              <Loader /> 
        </div>
      );
    }
    
    else {
      if (!this.state.isUserWithResetToken) {
        body= (
          <div>
            {/* Page is invalid or Password is already changed */}
            {t('auth.text26')}
          </div>
        );
      }

      if (this.state.isUserWithResetToken) {
        body = (
          <div>
            <Auth>
            <div>
              {/* Password reset page */}
              {t('auth.text23')}
            </div>

          <form onSubmit={e => {
            e.preventDefault();
            this.passwordResetHandler();
            }}
          >
            <Input
              id="password"
              // label="New Password"
              label={t('auth.text24')}
              placeholder="enter new password here..."
              type="password"
              control="input"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'password')}
              value={this.state.signupForm['password'].value}
              valid={this.state.signupForm['password'].valid}
              touched={this.state.signupForm['password'].touched}
            />
  
            <div className="auth-form__passwordLength">
              {/* Password should be 8 - 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&). */}
              {t('auth.text4')}
            </div>
  
            <Button design="raised" type="submit" loading={this.props.loading} disabled={!this.state.enoughPassword || !this.state.signupForm['password'].value}>
              {/* Reset Password */}
              {t('auth.text25')}
            </Button>

            <div className="auth-form__passwordResetMessage">
              {this.state.resetMessage}
            </div>
          
          </form>
        </Auth>
          </div>
        );
      }

      if (actionMode === '?mode=verifyEmail') {
        body = (<div>
          <div>
            {/* Email verification page */}
            {t('auth.text28')}
          </div>
          <div className="auth-form__emailVerifyMessage">
            {this.state.emailVerifyMessage}
          </div>

          {/* <div>
            <button onClick={() => {this.emailVerificationHandler()}}>veriyhandler-test</button>
          </div> */}
          </div>
          );
      }

    }
    return (
      <div>
        {body}
      </div>
    );

  }
}

export default withI18n()(UserActions);
// export default Signup;
