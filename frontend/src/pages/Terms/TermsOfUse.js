// const React = window.React = require('react');
import React from 'react';

import { useTranslation } from 'react-i18next/hooks';
import './TermsOfUse.css'

const TermsOfUse = props =>  {

  const [t] = useTranslation('translation');

    return <div>
      {/* <Generic> */}
        <h2 style={{fontSize:""}} className="Session__welcomeTitle">
          {/* Terms of use */}
          {t('termsOfUse.text1')}
          </h2>
        <div style={{fontSize:""}}>

          <h3 style={{fontSize:""}}>
            {/* Privacy */}
            {t('termsOfUse.text2')}
            </h3>
            {/* Your privacy is important to us. Please read the  */}
            {t('termsOfUse.text3')}
            <a href="/privacypolicy" className="terms__textLink">
              {/* <span> privacy policy </span> */}
              <span> {t('termsOfUse.text4')} </span>
            </a> 
            {/* for more information. */}
            {t('termsOfUse.text5')}
          <br />
          <h3 style={{fontSize:""}}>
            {/* Your own responsibilities */}
            {t('termsOfUse.text6')}
            </h3>
            {/* You, the user, are solely responsible for ensuring your own compliance with laws and taxes in your jurisdiction. You are solely responsible for your own security. */}
            {t('termsOfUse.text7')}
          {/* <br /> */}
          <br />
          <h3 style={{fontSize:""}}>
            {/* Disclaimer of warranty */}
            {t('termsOfUse.text8')}
            </h3>
            {/* StellarTerm is open source software licensed under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="nofollow noopener noreferrer">Apache-2.0 license</a>. It is provided fre of charge and on an <strong>"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND</strong>. This software includes the work that is distributed in the Apache License 2.0
            StellarSpace is based on Apache-2.0 license software. It is provided on an <strong>"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND</strong>. */}
            
            {/* This site is provided on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND. */}
            {t('termsOfUse.text9')}
          <br />
          <br />
          {props.accept ? <div>
            By pressing "
            {t('termsOfUse.text21')}
            <strong>
              Accept and Continue
              {t('termsOfUse.text22')}
              </strong>
            ", you acknowledge that you have read this document and agree to these terms of use.
            {t('termsOfUse.text23')}
            <div className="Session__tos__next">
              <button className="s-button" onClick={props.accept}>
                Accept and Continue
                {t('termsOfUse.text24')}
                </button>
            </div>
          </div> : null}
        </div>
      {/* </Generic> */}
    </div>
  
}
export default TermsOfUse;

