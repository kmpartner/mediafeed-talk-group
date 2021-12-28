const jwt = require('jsonwebtoken');

require('dotenv').config();

const testAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    
    // console.log('token', token);
    if (token === 'null') {
        return '';
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    
    // console.log('decodedToken', decodedToken);
    return decodedToken;
}

exports.testAuth = testAuth;