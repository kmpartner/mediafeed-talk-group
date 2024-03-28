const fetch = require('node-fetch');

const getUserNameData = async (req, res, next) => {
  try {
    console.log('req.query', req.query);

    const url = process.env.AUTHSSO_NODEURL + '/user-name-data'
    const authHeader = req.get('Authorization');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        // 'Accept': 'application/json',
      },
      // body: JSON.stringify(req.body)
    });

    const resData = await response.json();

    // console.log('response resData', response, resData);
    return res.status(response.status).json(resData);

  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// const updateUserName = async (req, res, next) => {
//   try {
    
//     if (!req.body.newName) {
//       const error = new Error('update name not found')
//       error.statusCode = 400;
//       throw error;
//     }

//     const url = process.env.AUTHSSO_NODEURL + '/user-name-data/user-name'
//     const authHeader = req.get('Authorization');

//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: {
//         Authorization: authHeader,
//         'Content-Type': 'application/json',
//         // 'Accept': 'application/json',
//       },
//       body: JSON.stringify(req.body)
//     });

//     const resData = await response.json();

//     // console.log('response resData', response, resData);
//     return res.status(response.status).json(resData);

//   } catch(err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

module.exports = {
  getUserNameData,
  // updateUserName,
}