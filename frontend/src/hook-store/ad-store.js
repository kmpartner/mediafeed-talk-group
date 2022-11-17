// import _ from 'lodash';

import { initStore } from "./store";

const configureStore = () => {
  const actions = {
    // SHOW_NOTIFICATION: (state, payload) => {
    //   const notifyContent = {
    //     status: payload.status,
    //     title: payload.title,
    //     message: payload.message,
    //   };
    //   return { 
    //     ...state,
    //     notification: notifyContent, 
    //     // i18n: state.i18next,
    //   };
    // },
    SET_ADLIST: (state, payload) => {
      return {
        // ...state,
        adStore: {
          ...state.adStore,
          adList: payload,
          adListGetDate: Date.now(),
        }
      };
    },
    SET_VIDEOADLIST: (state, payload) => {
      return {
        // ...state,
        adStore: {
          ...state.adStore,
          videoAdList: payload,
          adListGetDate: Date.now(),
        }
      };
    },
    // SET_FEEDLIST_DISPLAYED_ADLIST: (state, payload) => {
    //   let addedList = state.adStore.feedListDisplayedAdList.concat(payload);
    //   addedList = _.uniqBy(addedList, function(element) {
    //     return element.adElementId
    //   });

    //   return {
    //     ...state,
    //     adStore: {
    //       ...state.adStore,
    //       feedListDisplayedAdList: addedList,
    //     }
    //   };
    // },
  };

  initStore(actions, {
    adStore: {
      adList: [],
      adListGetDate: null,
      videoAdList: [],
      // feedListDisplayedAdList: [],
    }
  });
};

export default configureStore;
