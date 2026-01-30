const accountModel = require('../models/accountModel');
const encryptionMiddleware = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const refreshTokenModel = require('../models/refreshTokenModel');
const crypto = require('crypto');
const tokens = require('../utils/tokens');

// Create a new account
//TODO: add check for existing account with same email
exports.createAccountController = async (req, res) => {
    try {
        console.log('account creation info: ', req.body);
        req.body.password = await encryptionMiddleware.hashItem(req.body.password);
        console.log('Hashed password: ', req.body.password);
        //Add info to public account table
        const publicAccountDetails = await accountModel.createPublicAccountDetailsModel(req.body.accountName);
        console.log('Public account details: ', publicAccountDetails);
        const accountID = publicAccountDetails.account_id;

        //Add info to private account credentials table)
        const accountCredentials = await accountModel.createAccountCredentialsModel(req.body, accountID);
        console.log('Account credentials: ', accountCredentials);
        res.status(201).json(accountCredentials);
    } catch (error) {
        res.status(500).json({ message: 'Error creating account', error });
        console.error('Error creating account:', error);
    }
},

// Login to an account
exports.loginAccountController = async (req, res) => {
    try {
        console.log('account login info: ', req.body);

        const accountInfo = await accountModel.loginAccountModel(req.body);
        // If accountID is null or undefined, return an error
        if (!accountInfo) {
            return res.status(401).json({ message: 'Invalid email or password (accountInfo)' });
        }

        // Logic to login to an account
        const isPasswordValid = await encryptionMiddleware.checkHash(req.body.password, accountInfo.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password (passwordMatch)' });
        }

        // Generate JWT token
        const user = { account_id: accountInfo.account_id, account_email: req.body.email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Generate refresh token
        const jti = crypto.randomBytes(16).toString('hex');
        payload = { ...user, jti: jti };
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        const refreshTokenHash = await encryptionMiddleware.hashItem(refreshToken);
        const tokenData = {
            account_id: accountInfo.account_id,
            token_hash: refreshTokenHash,
            jti: jti,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
        // Set refresh token as HttpOnly cookie
        tokens.setRefreshCookie(res, refreshToken);

        const storedToken = await refreshTokenModel.createRefreshTokenModel(tokenData);
        console.log('Stored refresh token: ', storedToken);

        res.status(200).json({ message: 'Login successful', accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
        console.error('Error logging in:', error);
    }
}