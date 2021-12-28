import React from 'react';

import './Loader.css';

const loader = props => (
  <div className={props.loaderStyle ? props.loaderStyle : "loader"}>
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default loader;
