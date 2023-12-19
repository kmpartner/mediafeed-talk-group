// import _ from 'lodash';

import { initStore } from "./store";

const configureStore = () => {
  const actions = {
    SET_SHAREFILE: (state, payload) => {
      return {
        // ...state,
        shareStore: {
          ...state.shareStore,
          shareFile: payload,
        }
      };
    },
  };

  initStore(actions, {
    shareStore: {
      shareFile: null
    }
  });
};

export default configureStore;
