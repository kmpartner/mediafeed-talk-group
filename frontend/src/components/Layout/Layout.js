import React, { Fragment } from 'react';

import Notification from '../UI/notification';
import { useStore } from '../../hook-store/store';

import './Layout.css';

const Layout = props => {

  const [state, dispatch] = useStore();
  console.log(state);

  const notification = state.notification;

  return (
    <Fragment>
      <header className="main-header">{props.header}</header>
        {props.mobileNav}
      <main className="content">{props.children}</main>
      
      {notification && (
        <Notification
          status={notification.status}  // 'success' 'error' 'pending'
          title={notification.title}
          message={notification.message}
        />
      )}

      
      {/* <button onClick={() => {
          dispatch('SHOW_NOTIFICATION', {
            status: 'success',
            title: 'test-notify-pressed',
            message: '',
          });
        }}
      >
        test-notify
      </button>
      <button onClick={() => { dispatch('CLEAR_NOTIFICATION'); }} >
        test-notify-clear
      </button> */}

      {/* <Notification
        status='success'
        title='test-notify'
        message=''
      /> */}

    </Fragment>
  );
};

export default Layout;
