const jwt = require('jsonwebtoken');

require('dotenv').config();

export const authJwt = async (token: String) => {
  let decodedToken;
  try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
      return false;
      err.statusCode = 500;
      throw err;
  }
  if (!decodedToken) {
      return false;
  }
  // console.log('decodedToken', decodedToken);
  return true
};

export const authUserId = async (token: String) => {
  let decodedToken;
  try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
      console.log(err);
      return null;
      // err.statusCode = 500;
      // throw err;
  }
  if (!decodedToken) {
      return null;
  }
  // console.log('decodedToken', decodedToken);
  return decodedToken.userId;
};
