import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const button = props => {
  let buttonBody;
  if (!props.link) {
    buttonBody = (
      <button
        className={[
          'button',
          `button--${props.design}`,
          `button--${props.mode}`,
          `button--${props.size}`
        ].join(' ')}
        onClick={props.onClick}
        disabled={props.disabled || props.loading}
        type={props.type}
      >
        {props.loading ? 'Loading...' : props.children}
      </button>
    );
  }
  
  if (props.link) {
    buttonBody = (
      <Link
        className={[
          'button',
          `button--${props.design}`,
          `button--${props.mode}`,
          `button--${props.size}`
        ].join(' ')}
        to={props.link}
      >
        {props.children}
      </Link>
    );
  }

  if (props.link && props.action === 'viewpost' &&
    window.location.pathname.split('/')[2] === 'userposts'
  ) {
    const postLink = '/feed/' + props.link
    buttonBody = (
      <Link
        className={[
          'button',
          `button--${props.design}`,
          `button--${props.mode}`,
          `button--${props.size}`
        ].join(' ')}
        to={postLink}
      >
        {props.children}
      </Link>
    );
  }


  return (
    <span>
      {buttonBody}
    </span>
  );
}


export default button;
