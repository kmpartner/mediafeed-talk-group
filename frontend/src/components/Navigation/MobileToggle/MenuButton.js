import React from 'react';

import './MobileToggle.css';

const MenuButton = props => (
  <div className="menuButton" onClick={props.onOpen}>
    MENU
  </div>
);

export default MenuButton;