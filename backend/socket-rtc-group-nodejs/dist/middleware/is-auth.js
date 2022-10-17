"use strict";
const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
        // const error = new Error('Not authenticated.');
        // error.statusCode = 401;
        // throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
        // const error = new Error('Not authenticated.');
        // error.statusCode = 401;
        // throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
