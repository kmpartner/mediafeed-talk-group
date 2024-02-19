// import _ from 'lodash';

import { initStore } from "./store";

const configureStore = () => {
  const actions = {
    SET_PAGENOTIFICATION: (state, payload) => {
      return {
        // ...state,
        pageNotificationStore: {
          ...state.pageNotificationStore,
          pageNotification: payload,
        }
      };
    },
  };

  initStore(actions, {
    pageNotificationStore: {
      pageNotification: null
    }
  });
};

export default configureStore;
