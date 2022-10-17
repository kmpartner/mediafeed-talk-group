import React, { Component } from 'react';
import { withI18n } from "react-i18next";

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { required, length, email, validComplexPassword } from '../../util/validators';
import Auth from './Auth';

class Signup extends Component {
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
    }
  };

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
    console.log(validComplexPassword(input));
    return validComplexPassword(input);
  }

  render() {
    // console.log('signup props', this.props);
    const { t } = this.props;

    return (
      <Auth>
        <form onSubmit={e => this.props.onSignup(e, this.state)}>
          <Input
            id="email"
            // label="Your E-Mail"
            label={t('auth.text1')}
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.signupForm['email'].value}
            valid={this.state.signupForm['email'].valid}
            touched={this.state.signupForm['email'].touched}
          />
          <Input
            id="name"
            // label="Your Name"
            label={t('auth.text2')}
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'name')}
            value={this.state.signupForm['name'].value}
            valid={this.state.signupForm['name'].valid}
            touched={this.state.signupForm['name'].touched}
          />
          <Input
            id="password"
            // label="Password"
            label={t('auth.text3')}
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
          {this.props.loading ? 
            <div className="auth-form__loader">
              <Loader /> 
            </div>
            : null
          }

          <Button design="raised" type="submit" loading={this.props.loading} disabled={!this.state.enoughPassword}>
            {/* Signup */}
            {t('auth.text5')}
          </Button>
        </form>

        <div className="auth-form__emailVerifyMessage">
          {this.props.sendVerifyMailMessage}
        </div>

      </Auth>
    );
  }
}

export default withI18n()(Signup);
// export default Signup;
