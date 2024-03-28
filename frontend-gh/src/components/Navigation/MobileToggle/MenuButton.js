import React from 'react';
import { useTranslation } from 'react-i18next/hooks';

import './MobileToggle.css';

const MenuButton = props => {

  const [t] = useTranslation('translation');

  return (
    <div className="menuButton" onClick={props.onOpen}>
      {/* MENU */}
      {t('nav.text7', 'MENU')}
    </div>
  );
};

export default MenuButton;