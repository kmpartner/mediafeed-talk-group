import { initStore } from "./store";

const configureStore = () => {
  const actions = {
    SHOW_NOTIFICATION: (state, payload) => {
      const notifyContent = {
        status: payload.status,
        title: payload.title,
        message: payload.message,
      };
      return { 
        ...state,
        notification: notifyContent, 
        // i18n: state.i18next,
      };
    },
    CLEAR_NOTIFICATION: (state, payload) => {
      // const notifyContent = {
      //   status: null,
      //   title: null,
      //   message: null,
      // };
      return { 
        ...state,
        notification: null,
        // notification: notifyContent,
        // i18n: state.i18next,
       };
    },
    SET_USERSDATA: (state, payload) => {
      return {
        ...state,
        usersData: payload,
      }
    },
    SET_GROUP_USERSDATA: (state, payload) => {
      return {
        ...state,
        groupUsersData: payload,
      }
    },
    SET_GROUPMEMBER_IMAGEURLS: (state, payload) => {
      return {
        ...state,
        groupMemberImageUrls: payload,
      }
    },
    SET_USERDATA: (state, payload) => {
      return {
        ...state,
        userData: payload,
      }
    },
    SET_GROUP_IMAGEURLS: (state, payload) => {
      return {
        ...state,
        groupImageUrls: payload,
      }
    },
    SET_GROUP_LISTDATA: (state, payload) => {
      return {
        ...state,
        groupListData: payload,
      }
    },
    SET_VIEW_PAGE: (state, payload) => {
      return {
        ...state,
        viewPage: payload,
      }
    },
    SET_GOT_POSTS: (state, payload) => {
      return {
        ...state,
        gotPosts: payload,
      }
    },
    SET_WINDOW_VALUES: (state, payload) => {
      return {
        ...state,
        windowValues: payload,
      }
    },
    SET_BOWSERDATA: (state, payload) => {
      return {
        ...state,
        bowserData: payload,
      }
    },
    SET_TALKPERMISSION: (state, payload) => {
      return {
        ...state,
        talkPermission: payload,
      }
    },
    SET_DEFERREDPROMPT: (state, payload) => {
      return {
        ...state,
        deferredPrompt: payload,
      }
    },
    SET_USERNAMEDATA: (state, payload) => {
      return {
        ...state,
        userNameData: payload,
      }
    },
    SET_NAMEDATALIST: (state, payload) => {
      return {
        ...state,
        nameDataList: payload,
      }
    },
    SET_SHOWDRAWDREAMERMODAL: (state, payload) => {
      return {
        ...state,
        showDrawDreamerModal: payload,
      }
    },

    // SET_I18NEXT: (state, payload) => {
    //   return { 
    //     notification: state.notification,
    //     i18n: payload,
    //   }
    // }
  };

  initStore(actions, {
    notification: null,
    usersData: [],
    groupUsersData: [],
    groupMemberImageUrls: [],
    groupImageUrls: [],
    groupListData: [],
    userData: null,
    viewPage: 1,
    gotPosts: [],
    windowValues: null,
    bowserData: null,

    talkPermission: null,

    deferredPrompt: null,
    userNameData: null,
    nameDataList: [],
    showDrawDreamerModal: false,
    // lastPage: 0,
    // notification: {
    //   status: null,
    //   title: null,
    //   message: null,
    // },
    // i18n : undefined
  });
};

export default configureStore;
