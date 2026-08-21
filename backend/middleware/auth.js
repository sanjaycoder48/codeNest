const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const header = req.header('Authorization') || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
