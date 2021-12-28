const jwt = require('jsonwebtoken');

require('dotenv').config()

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
        // const error = new Error('Not authenticated.');
        // error.statusCode = 401;
        // throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        req.isAuth = false;
        return next();
        // err.statusCode = 500;
        // throw err;
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
        // const error = new Error('Not authenticated.');
        // error.statusCode = 401;
        // throw error;
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}