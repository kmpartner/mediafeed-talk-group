import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next/hooks';
import _ from 'lodash';

import i18n from '../i18n';
import { resources } from './translation'

import "./LanguageList.css";

const LanguageList = (props) => {
  console.log('props-LanguageList.js', props);

  const [t] = useTranslation('translation');

  const [showLanguageList, setShowLanguageList] = useState(false);

  useEffect(() => {
    // findLanguageName(props.i18n.language);
  },[]);

  // const showLanguageListHandler = () => {
  //   setShowLanguageList(!showLanguageList);
  // };

  const changeLanguage = (input) => {
    i18n.changeLanguage(input);
  }

  const findLanguageName = (code) => {
    const languageInfo = resources[code];
    console.log(languageInfo);
  }

  const storeUserSelectLanguage = (code) => {
    localStorage.setItem('userSelectLng', code);
  }

  const languageNameList = [];

  for (const element in resources) {
    // console.log(element, resources[element].translations.LANGUAGE);
    languageNameList.push({
      code: element,
      LANGUAGE: resources[element].translation.LANGUAGE
    });
  }
  console.log(languageNameList)

  const sortedLanguageList = _.sortBy(languageNameList, 'LANGUAGE') 
  const languageListBody = (
      <ul>
        {sortedLanguageList.map((ele, index) => {
            return (
            <div key={index} className="listElement">
              {/* {ele.code}  */}
              <span 
                onClick={() => {
                  changeLanguage(ele.code);
                  props.showLanguageModalHandler();
                  storeUserSelectLanguage(ele.code);
                  // props.getLanguageNameHandler(ele.LANGUAGE)
                }}
              >
                {ele.LANGUAGE}
              </span>
            </div>
            );
          })
        }
      </ul>

  );

  return (
    <div>
      {languageListBody}
    </div>

  );
}

export default LanguageList