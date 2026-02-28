const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, tokenFromHeader] = authHeader.split(' ');
    const tokenFromCookie = req.cookies ? req.cookies['token'] : null;

    const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    console.log('scheme:', scheme, '\n token:', token);

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing or unauthorized header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('This is to test the decoded:', decoded);

        req.user = { id: decoded.id, email: decoded.accountEmail, isAdmin: decoded.isAdmin };
        next();
    } catch (error) {
        console.log('error authorizing: ', error);
        return res.status(401).json({ messgae: 'Unauthorized' });
    }
}

module.exports = authenticateToken;