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
        ...state,
        adStore: {
          ...state.adStore,
          adList: payload,
          adListGetDate: Date.now(),
        }
      };
    },
  };

  initStore(actions, {
    // notification: null,
    adStore: {
      adList: [],
      adListGetDate: null,
    }
  });
};

export default configureStore;
