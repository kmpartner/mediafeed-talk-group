import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const TransBackdrop = props =>
  ReactDOM.createPortal(
    <div
      // className={['transbackdrop', props.open ? 'open' : ''].join(' ')}
      className={props.backdropClassName 
        ? [`${props.backdropClassName}`, props.open ? 'open' : ''].join(' ')
        : ['transbackdrop', props.open ? 'open' : ''].join(' ')
      }
      // className={[props.open ? 'transbackdrop' : ''].join(' ')}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root')
  );

export default TransBackdrop;
