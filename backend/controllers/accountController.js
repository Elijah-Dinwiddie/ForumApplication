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
        res.status(500).json({ message: 'Error creating account' });
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
        res.status(500).json({ message: 'Error logging in' });
        console.error('Error logging in:', error);
    }
},

// Rotate access token and refresh token
// TODO: create util functions for token generation
exports.refreshController = async (req, res) => {
    try {
        // Get refresh token from HttpOnly cookie
        const refreshToken = req.cookies.refreshToken;

        // If no refresh token is provided, return an error
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Decode the refresh token to get the jti
        const jti = refreshToken ? jwt.decode(refreshToken).jti : null;

        // Get the stored refresh token from the database
        const storedToken = await refreshTokenModel.getRefreshTokenByJtiModel(jti);
        
        // If no stored token is found, return an error
        if (!storedToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Check if the refresh token has been revoked
        if  (storedToken.revoked_at) {
            // Revoke all tokens for this account
            const revokedTokens = await refreshTokenModel.revokeAllTokensByAccountIdModel(storedToken.account_id);
            console.log('Revoked all tokens for account ID ', storedToken.account_id, ': ', revokedTokens);
            return res.status(401).json({ message: 'Refresh token has been revoked' });
        }

        // Check if the refresh token has expired
        if (storedToken.expires_at < new Date()) {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        
        // Compare the provided refresh token with the stored token hash
        const isTokenValid = await encryptionMiddleware.checkHash(refreshToken, storedToken.token_hash);

        // If the tokens do not match, return an error
        if (!isTokenValid) {
            return res.status(401).json({ message: 'Refresh token does not match' });
        }

        // Generate new JWT token
        const user = { account_id: decoded.account_id, account_email: decoded.account_email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Generate new refresh token
        const refreshTokenData = await tokens.generateRefreshToken(user);
        
        // Set new refresh token as HttpOnly cookie
        tokens.setRefreshCookie(res, refreshTokenData.refreshToken);

        // Update old refresh token's revoked_at and replaced_by fields
        let updateData;
        try {
            updateData = await refreshTokenModel.updateRefreshTokenModel(jti, refreshTokenData.jti);
        } catch (error) {
            console.error('Error updating old refresh token:', error);
            return res.status(500).json({ message: 'Could not update old refresh token'});
        }
        console.log('Updated old refresh token: ', updateData);

        // If update fails, return an error
        if (!updateData) {
            return res.status(500).json({ message: 'Could not update old refresh token' });
        }
        
        res.status(200).json({ message: 'Tokens refreshed', accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Error refreshing tokens' });
        console.error('Error refreshing tokens:', error);
    }
},

//Update Account name and email
//TODO: Write tests for if one/both of the request body fields if null or ''
exports.updateAccountController = async (req, res) => {
    try {
        console.log('updating account: ', req.params.accountId);
        console.log('with: ', req.body);
        const updatedAccountID = req.params.accountId;
        const updateInformation = req.body

        // if no data inputed return 406 Not acceptable
        if ((!updateInformation.email || updateInformation.email === '') && (!updateInformation.accountName || updateInformation.accountName === '')) {
            res.status(406).json({ message: "No data given"});
        }
        else if (!updateInformation.email || updateInformation.email === '') { // update only name if no email given
            const updatedAccountName = await accountModel.updateAccountNameModel(updatedAccountID, updateInformation);
            console.log('updatedAccount results1: ', updatedAccountName);
            res.status(200).json({ message: 'account updated', updatedAccountName });
        }
        else if (!updateInformation.accountName || updateInformation.accountName === '') { // update only email if no name given
            const updatedAccountEmail = await accountModel.updateAccountEmailModel(updatedAccountID, updateInformation)
            console.log('updatedAccount results2: ', updatedAccountEmail);
            res.status(200).json({ message: 'account updated', updatedAccountEmail});
        }
        else { // update both name and email
            const updatedAccountName = await accountModel.updateAccountNameModel(updatedAccountID, updateInformation);
            const updatedAccountEmail = await accountModel.updateAccountEmailModel(updatedAccountID, updateInformation);
            console.log('updatedAccount results3: ', updatedAccountName, updatedAccountEmail);
            res.status(200).json({ message: 'account updated'});
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating account'});
        console.error('Error updating account: ', error);
    }
}

//Delete account (sets isDeleted to null, will want logic on frontend to display "ACCOUNT DELETE" instead of username for their forums/threads/posts)
exports.deleteAccountController = async (req, res) => {
    try {
        console.log('deleting account: ', req.params.accountId);
        const accountID = req.params.accountId;

        const deleteInfo = await accountModel.deleteAccountModel(accountID);

        res.status(200).json({ message: 'Account deleted'});

    } catch (error) {
        res.status(500).json({ message: 'Error deleting account'});
        console.error  ('Error deleting account: ', error);
    }
}