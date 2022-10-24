// imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

// middleware for authorization 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next() 
    } catch(error) {
        res.status(403).json({ message : "Unauthorized request" })
    }
};