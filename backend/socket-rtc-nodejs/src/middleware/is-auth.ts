const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req: any, res: any, next: any) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        // error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        // err.statusCode = 500;
        // err.statusCode = 401;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        // error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}