// const React = window.React = require('react');
import React from 'react';
// import Generic from './Generic.jsx';

import { useTranslation } from 'react-i18next/hooks';

const PrivacyPolicy = (props) => {
  const [t] = useTranslation('translation');

  return (
    <div style={{ fontSize: "" }}>
      <p style={{ fontWeight: "bold" }}>
        {/* Privacy Policy */}
        {t('privacyPolicy.text1')}</p>
      <p>
        {/* This policy may be updated or revised without notice. It is the responsibility of the user to stay informed about privacy policy changes. Take note of other privacy issues that may affect you: */}
        {t('privacyPolicy.text2')}
      </p>
      <ul className="privacy__ul">
      
        <li>
          {/* This website might be compromised. */}
          {t('privacyPolicy.text3')}
        </li>

        <li>
          {/* Your computer might be compromised. */}
          {t('privacyPolicy.text4')}
        </li>
        <li>
          {/* This website is hosted on Firebase and DigitalOcean infrastructures. They may and do have their own tracking systems on their servers. Those services have their own privacy policies and they are not covered by this privacy policy. */}
          {t('privacyPolicy.text5')}
        </li>
        <li>
          {/* This website stores email, encrypted form of password, and other inputs of users at hosted Firebase and DigitalOcean infrastructures. */}
          {t('privacyPolicy.text6')}
        </li>


      </ul>

    </div>
  )
}
export default PrivacyPolicy;