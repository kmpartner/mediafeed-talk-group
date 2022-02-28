import React, { Fragment, useEffect, useState } from "react";

import { BASE_URL } from "../../App";

const AuthCheck = (props) => {
  const { isAuth, logoutHandler2 } = props;

  const [authCheckStart, setAuthCheckStart] = useState(false);

  useEffect(() => {
    if (!authCheckStart) {
      setAuthCheckStart(true);

      if (localStorage.getItem('token')) {
        authCheck();
      }
      
      setInterval(() => {
        // console.log('in setInterval')
        // console.log('lsToken', localStorage.getItem('token'));
        if (localStorage.getItem('token')) {
          authCheck();
        }
      }, 1000 * 60 * 60);
    }
  }, []);

  const authCheck = () => {
    //// check auth validity and logout
      fetch(BASE_URL + "/auth/status", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          console.log(res);
  
          //// logout when invalid auth
          if (res.status === 401) {
            logoutHandler2();
          }
          if (res.status !== 200) {
            throw new Error("Failed to fetch user status.");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
        })
        .catch((err) => {
          console.log(err);
        });
    
  };

  return <Fragment></Fragment>;
};

export default AuthCheck;
