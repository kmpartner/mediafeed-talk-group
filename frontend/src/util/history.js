export const putBrowserHistory = (url, data) => {
  fetch(url + `/history/put-history`, {
    method: 'PUT',
    headers: {
      // Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Put history failed!");
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);

      // resolve({ message: 'Put history success', data: resData.data });
    })
    .catch(err => {
      console.log(err);
      // reject({ message: 'Put history failed', error: err });
    });
};

// import React from 'react';
// import { withRouter } from 'react-router';

// // variable which will point to react-router history
// let globalHistory = null;

// // component which we will mount on top of the app
// class History extends React.Component {
//   constructor(props) {
//     super(props)
//     globalHistory = props.history; 
//   }

//   componentDidUpdate() {
//     globalHistory = this.props.history;
//     console.log(globalHistory);
//   }

//   render(){
//     return null;
//   }
// }

// export const GlobalHistory = withRouter(History);

// // export react-router history
// export default function getHistory() {    
//   return globalHistory;
// }