import React from 'react';
import { NavLink, Link } from 'react-router-dom';
const NeedToLogin = props => {
  // console.log('need-to-login-props', props);

  return (
    <div>
      Need-to-login
      <Link to="/login"><div>not found may need goto-Login-page</div></Link>
    </div>
  );
}

export default NeedToLogin;