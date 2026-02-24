const jwt = require('jsonwebtoken');
const accountModel = require('../models/accountModel');

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

        const account = await accountModel.getAccountModel(decoded.account_id);
        console.log('This is the account: ', account);

        if(account.is_deleted === true) {
            console.log('User has been deleted, token should not work')
            return res.status(401).json({ message: 'invalid credentials'})
        }

        req.user = { id: decoded.account_id, email: decoded.account_email };
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Unauthorized' });
    }
}

module.exports = authenticateToken;