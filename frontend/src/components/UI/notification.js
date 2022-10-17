// import { useContext } from 'react';
import React from 'react';
import { useStore } from '../../hook-store/store';

import classes from './notification.module.css';
// import NotificationContext from '../../store/notification-context';

function Notification(props) {
  // const notificationCtx = useContext(NotificationContext);
  
  const { title, message, status } = props;

  const [store, dispatch] = useStore();
  // console.log(store);

  let statusClasses = '';

  if (status === 'success') {
    statusClasses = classes.success;
  }

  if (status === 'error') {
    statusClasses = classes.error;
  }

  if (status === 'pending') {
    statusClasses = classes.pending;
  }

  const activeClasses = `${classes.notification} ${statusClasses}`;

  return (
    <div className={activeClasses} 
      // onClick={notificationCtx.hideNotification}
    >
      {/* <h2>{title}</h2>
      <p>{message}</p> */}
      <div className={classes.notificationCloseButton}>
        <strong className={classes.notificationCloseButtonX}
          onClick={() => { dispatch('CLEAR_NOTIFICATION'); }}
        >X</strong>
      </div>
      <p>{title}</p>
      <p>{message}</p>
    </div>
  );
}

export default Notification;