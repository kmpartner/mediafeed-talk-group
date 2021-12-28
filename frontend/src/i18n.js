import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { reactI18nextModule } from "react-i18next";
import { initReactI18next } from 'react-i18next/hooks'

import LanguageDetector from 'i18next-browser-languagedetector';

import { resources } from './translation/translation';

console.log('navigator.languages in I18N.js', navigator.languages);
let detectedLanguage = navigator.languages[0];

if (!resources[detectedLanguage]) {
  detectedLanguage = navigator.languages[0].split('-')[0];
  if (!resources[navigator.languages[0].split('-')[0]]) {
    detectedLanguage = 'en'
  }
}
console.log(detectedLanguage);

// console.log(locales);
// console.log(resources);
// const detectedLanguageJoin = navigator.languages[0].split('-').join('');
// console.log(detectedLanguageJoin);

// const resources = {
//   en: {
//     translation: {
//       "hello world": " en hello world from i18n !!!"
//     }
//   },
//   zhCN: {
//     translation: {
//       "hello world": " zhCN hello world from i18n !!!"
//     }
//   }
// };

i18n
  .use(reactI18nextModule) 
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources,
    resources: resources,
    lng: detectedLanguage,
    fallbackLng: 'en',
    debug: true,
    // backend: {
    //   /* translation file path */
    //   loadPath: '/assets/i18n/{{ns}}/{{lng}}.json'
    // },
    // /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
    // ns: ['translations'],
    // defaultNS: 'translations',

    // resources: {
    //   en: {
    //     translation: {
    //       "hello world": "hello world from i18n !!!"
    //     }
    //   }
    // },

    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    },
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // order: ['querystring',  'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],    

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['localStorage', 'cookie'],
      // caches: ['localStorage'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

      // optional expire and domain for set cookie
      cookieMinutes: 10,
      cookieDomain: 'myDomain',

      // optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement
    }
  }, (err, t) => {
    if (err) {
      return console.log('something went wrong loading', err);
    }
    console.log(t);
    // return t;
  })

export default i18n