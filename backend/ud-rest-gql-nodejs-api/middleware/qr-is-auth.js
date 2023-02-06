const jwt = require('jsonwebtoken');

const User = require('../models/user/user');

require('dotenv').config();

module.exports = async (req, res, next) => {
  try {

    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        // err.statusCode = 500;
        err.statusCode = 401;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const user = await User.findOne({ _id: decodedToken.uId });

    if (!user) {
      const error = new Error('user not found.');
      error.statusCode = 404;
      throw error;
    }

    // console.log('decodedToken, user', decodedToken, user);

    // throw new Error('error-error');

    req.userId = user.userId;
    next();

  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}