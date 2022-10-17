import React from "react";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

import "./Logo.css";

const logo = (props) => {
  const currentUrl = new URL(window.location.href);
  const firstPath = currentUrl.pathname.split("/")[1].split("-")[0];

  let logoLink;
  if (firstPath === "feed") {
    logoLink = "/feed/posts";
  } else {
    logoLink = currentUrl.pathname;
  }

  // console.log(currentUrl, firstPath);
  let logoBody;

  if (!firstPath) {
    logoBody = null;
  }

  if (firstPath === "feed") {
    logoBody = (
      <NavLink to={logoLink}>
        <span className="logo">feedPost</span>
      </NavLink>
    );
  } 
  
  else {
    logoBody = <span className="logo">{firstPath}</span>;
  }

  return <Fragment>{logoBody}</Fragment>;
};

export default logo;
