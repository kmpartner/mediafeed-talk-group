import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withI18n } from "react-i18next";

import i18n from '../../i18n';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Loader from '../../components/Loader/Loader';
import { required, length, email, validComplexPassword } from '../../util/validators';
import { getTokenForPasswordReset } from '../../util/user';
import { setCaretPosition } from '../../util/style';
import Auth from './Auth';

// import * as firebase from "firebase/app";

// // Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { BASE_URL } from '../../App';

console.log('in login.js');
console.log(i18n);

class Login extends Component {
  state = {
    loginForm: {
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
      formIsValid: false,
      enoughPassword: false,
      forgetPassword: false,
      passwordResetInput: '',
      passwordResetLoading: false,
      isEmailInputValid: false,
      sendEmailMessage: '',
      showPassword: false,
      error: null,
    }
  };

  componentDidMount () {
    // console.log('login didmount');
    setCaretPosition('email', 0);
  }

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        loginForm: updatedForm,
        formIsValid: formIsValid
      };
    }, () => {
      if (this.passwordValidity(this.state.loginForm.password.value)) {
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
        loginForm: {
          ...prevState.loginForm,
          [input]: {
            ...prevState.loginForm[input],
            touched: true
          }
        }
      };
    });
  };

  forgetPasswordHandler = () => {
    this.setState({
      forgetPassword: true,
    });
  }

  passwordResetInputHandler = (input, value) => {
    this.setState({
      passwordResetInput: value,
      isEmailInputValid: email(value),
    });
    // console.log(this.state.passwordResetInput);
  }

  sendPasswordResetMailHandler = () => {
    this.setState({ passwordResetLoading: true });
    var auth = firebase.auth();
    auth.useDeviceLanguage();
    console.log(auth.languageCode);
    var emailAddress = this.state.passwordResetInput;

    getTokenForPasswordReset(BASE_URL, emailAddress)
      .then(result => {
        console.log(result);

        return auth.sendPasswordResetEmail(emailAddress)
      })
          .then(() => {
            // Email sent.
            console.log('password reset mail was sent');
            
            this.setState({
              // sendEmailMessage: 'email for password rest was sent',
              sendEmailMessage: i18n.t('auth.text19'),
              passwordResetLoading: false
            });
          })
          .catch((err) => {
            // An error happened.
            console.log(err);
            if (err.code === 'auth/user-not-found') {
              err.message = 'Enterd email was not found'
              err.message = i18n.t('auth.text19')
            }

            // err.message = 'Sending email for password reset failed, Please check email address'
            err.message = i18n.t('auth.text27');
            this.setState({
              error: err,
              passwordResetLoading: false
            });
          });

      // })
      // .catch(err => {
      //   console.log(err);
      // });

  }

  errorHandler = () => {
    this.setState({ error: null });
  };

  passwordValidity = (input) => {
    // console.log(event.target.value);
    console.log(validComplexPassword(input));
    return validComplexPassword(input);
  }

  showPasswordHandler = (event) => {
    event.preventDefault()
    this.setState({ showPassword: !this.state.showPassword })
  }

  render() {
    console.log('login props', this.props);
    const { t } = this.props;

    return (
      <Auth>
        <form
          onSubmit={e =>
            this.props.onLogin(e, {
              email: this.state.loginForm.email.value,
              password: this.state.loginForm.password.value
            })
          }
        >

          <Input
            id="email"
            // label="Your E-Mail"
            label={i18n.t('auth.text1')}
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.loginForm['email'].value}
            valid={this.state.loginForm['email'].valid}
            touched={this.state.loginForm['email'].touched}
          />
          <Input
            id="password"
            // label="Password"
            label={i18n.t('auth.text3')}
            // type="password"
            type={this.state.showPassword ? '' : 'password'}
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.loginForm['password'].value}
            valid={this.state.loginForm['password'].valid}
            touched={this.state.loginForm['password'].touched}
          />

          <div className="auth-form__showPasword" onClick={this.showPasswordHandler}>
            {/* {!this.state.showPassword ? 'Show Password' : 'Hide Password'} */}
            {!this.state.showPassword ? i18n.t('auth.text17') : i18n.t('auth.text18')}
          </div>

          {this.props.loading ?
            <div className="auth-form__loader">
              <Loader />
            </div>
            : null
          }

          <Button design="raised" type="submit" loading={this.props.loading} disabled={!this.state.enoughPassword}>
            {/* Login */}
            {i18n.t('auth.text6')}
          </Button>
        </form>

        <div className="auth-form__passwordLength">
          {/* Password should be 8 - 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&). */}
          {i18n.t('auth.text4')}
        </div>

        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <div className="auth-form__foregtPassword" onClick={this.forgetPasswordHandler}>
          {/* Forget Password ? */}
          {i18n.t('auth.text7')} ?
          </div>
        {this.state.forgetPassword ?
          <div>
            <Input
              id="email-for-reset"
              // label="E-Mail address for password reset"
              label={i18n.t('auth.text9')}
              type="email"
              control="input"
              onChange={this.passwordResetInputHandler}
              // onBlur={this.inputBlurHandler.bind(this, 'email')}
              value={this.state.passwordResetInput}
            // valid={ture}
            // touched={false}
            />

            <Button design="raised" type="submit" loading={this.state.passwordResetLoading}
              disabled={!this.state.isEmailInputValid || this.state.passwordResetLoading} 
              onClick={this.sendPasswordResetMailHandler}>
              {/* Send Email */}
              {i18n.t('auth.text10')}
            </Button>

            {this.state.passwordResetLoading ? 
              <div className="auth-form__loader">
              <Loader />
              </div>
            : null
            }

            <div className="auth-form__emailVerifyMessage">
              {this.state.sendEmailMessage}
            </div>
            
          </div>
          : null
        }

        <div className="auth-form__signupLink">
          <Link className="auth-form__signupLink" to="/signup" exact >
            {/* Signup-Page */}
            {i18n.t('auth.text8')}
          </Link>
        </div>
      </Auth>
    );
  }
}

export default withI18n()(Login);
// export default Login;
