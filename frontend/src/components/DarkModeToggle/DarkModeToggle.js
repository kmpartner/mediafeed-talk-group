import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import useDarkMode from 'use-dark-mode';

import Button from '../Button/Button'
import './DarkModeToggle.css';
import { composeInitialProps } from 'react-i18next/hooks';
 
// import Toggle from './Toggle';
 
// const DarkModeToggle = () => {
//   const darkMode = useDarkMode(false);
 
//   return (
//     <div>
//       <button type="button" onClick={darkMode.disable}>
//         ☀
//       </button>
//       <Toggle checked={darkMode.value} onChange={darkMode.toggle} />
//       <button type="button" onClick={darkMode.enable}>
//         ☾
//       </button>
//     </div>
//   );
// };

const DarkModeToggle = (props) => {
  const darkMode = useDarkMode(false);
  const [t] = useTranslation('translation')
  console.log(darkMode);

  useEffect(() => {
    props.setDarkMode(darkMode.value);
  },[darkMode.value]);

  return (
  <div>
    <span>
      {/* Dark Mode:  */}
      {t('userInfo.text8')}:
    </span>
    {' '}
    <Button mode="flat" type="submit" onClick={darkMode.toggle}>
      {darkMode.value ? 'On' : 'Off'}
    </Button>
    {/* <Button mode="raised" type="submit" onClick={darkMode.toggle}>
    {darkMode.value ? 'Disable' : 'Enable'}
    </Button> */}
    {/* <button onClick={darkMode.toggle}>Dark Mode Switch</button> */}
    {/* <div>some-text-in-darkmodetoggle</div> */}
    
    </div>);
    
}
 
export default DarkModeToggle;