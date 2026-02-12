const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, tokenFromHeader] = authHeader.split(' ');
    const tokenFromCookie = req.cookies ? req.cookies['token'] : null;

    const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    console.log('scheme:', scheme, '\n token:', token);

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing or unauthorized header' });
    }

    //TODO: Change email to instead be account name
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { id: decoded.account_id, email: decoded.account_email };
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Unauthorized' });
    }
}

module.exports = authenticateToken;