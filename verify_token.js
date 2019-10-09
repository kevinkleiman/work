const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header['auth-token'];
    console.log(token);
    if (!token) return res.status(401).send('Access Denied');
    try {
        jwt.verify(token, process.env.SECRET);
        console.log('Token Accepted');
        next();
    } catch (e) {
        throw e;
        res.status(400).send('Invalid Token');
    }
};