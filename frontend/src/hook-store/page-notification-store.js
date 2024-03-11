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
    SET_PAGENOTIFICATION_CREATORUSERNAMEDATALIST: (state, payload) => {
      return {
        // ...state,
        pageNotificationStore: {
          ...state.pageNotificationStore,
          pageNotificationCreatorUserNameDataList: payload,
        }
      };
    },
  };

  initStore(actions, {
    pageNotificationStore: {
      pageNotification: null,
      pageNotificationCreatorUserNameDataList: [],
    }
  });
};

export default configureStore;
