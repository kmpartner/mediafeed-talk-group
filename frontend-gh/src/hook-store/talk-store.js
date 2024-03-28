import { initStore } from "./store";

const configureStore = () => {
  const actions = {

    SET_TALKUSERSDATA: (state, payload) => {
      return {
        // ...state,
        talkStore: {
          ...state.talkStore,
          talkUsersData: payload
        }
      };
    },
    // SET_I18NEXT: (state, payload) => {
    //   return { 
    //     notification: state.notification,
    //     i18n: payload,
    //   }
    // }
  };

  initStore(actions, {
    talkStore: {
      talkUsersData: [],
    }
  });
};

export default configureStore;
