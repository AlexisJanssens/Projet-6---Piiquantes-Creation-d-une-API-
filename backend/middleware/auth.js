// imports
const jwt = require('jsonwebtoken');

// middleware for authorization 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'qsdkjahzueyudhfjdhfazeakzepsodkdlfoijezkljfsdpfipaozeakzjfdsifakjksdjk');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next() 
    } catch(error) {
        res.status(401).json({ error })
    }
};