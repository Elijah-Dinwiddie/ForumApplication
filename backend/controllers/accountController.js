const accountModel = require('../models/accountModel');
const encryptionMiddleware = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const refreshTokenModel = require('../models/refreshTokenModel');
const crypto = require('crypto');
const tokens = require('../utils/tokens');

// Create a new account
exports.createAccountController = async (req, res) => {
    try {
        if(!req.body.email || !req.body.accountName || !req.body.password) {
            return res.status(400).json({ message: 'Not all fields provided' });
        }

        console.log('account creation info: ', req.body);

        const emailTaken = await accountModel.getAccountsWithEmailModel(req.body.email);

        console.log('emailtaken: ', emailTaken);

        if(emailTaken.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        req.body.password = await encryptionMiddleware.hashItem(req.body.password);

        //Add info to public account table
        const publicAccountDetails = await accountModel.createPublicAccountDetailsModel(req.body.accountName);
        console.log('Public account details: ', publicAccountDetails);
        const accountID = publicAccountDetails.account_id;

        //Add info to private account credentials table)
        const accountCredentials = await accountModel.createAccountCredentialsModel(req.body, accountID);
        console.log('Account credentials: ', accountCredentials);
        return res.status(201).json({ message: 'Account created' });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ message: 'Error creating account' });
    }
},

// Login to an account
exports.loginAccountController = async (req, res) => {
    try {
        if(!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Not all fields provided' });
        }

        console.log('account login info: ', req.body);

        const accountInfo = await accountModel.loginAccountModel(req.body);
        console.log('Account info: ', accountInfo);

        // If accountID is null or undefined, return an error
        if (!accountInfo) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if(accountInfo.is_deleted == true) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        // Logic to login to an account
        const isPasswordValid = await encryptionMiddleware.checkHash(req.body.password, accountInfo.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const user = { id: accountInfo.account_id, accountEmail: req.body.email, isAdmin: accountInfo.isAdmin };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        const id = accountInfo.account_id;

        // Generate refresh token
        const refreshTokenData = await tokens.generateRefreshToken(accountInfo, id);

        // Set new refresh token as HttpOnly cookie
        tokens.setRefreshCookie(res, refreshTokenData.refreshToken);

        return res.status(200).json({ message: 'Login successful', accessToken });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Error logging in' });
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
            console.log('decoded: ', decoded);

            const account = await accountModel.getAccountModel(decoded.id);
            console.log('isdeleted: ', account.is_deleted);

            //Check if account is deleted. If so return 401
            if(account.is_deleted == true) {
                console.log('The refresh token cannot be used because the account is deleted');
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            console.log('decoded token: ', decoded);
        } catch (error) {
            console.log('Error: ', error);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Get the stored refresh token from the database
        const storedToken = await refreshTokenModel.getRefreshTokenByJtiModel(decoded.jti);
        
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
        const user = { id: decoded.id, accountEmail: decoded.accountEmail, isAdmin: decoded.isAdmin};
        console.log('user: ', user);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Generate new refresh token
        const refreshTokenData = await tokens.generateRefreshToken(user, user.id);

        // Update old refresh token's revoked_at and replaced_by fields
        let updateData;
        try {
            updateData = await refreshTokenModel.updateRefreshTokenModel(decoded.jti, refreshTokenData.jti);
        } catch (error) {
            console.error('Error updating old refresh token:', error);
            return res.status(500).json({ message: 'Could not update old refresh token'});
        }
        console.log('Updated old refresh token: ', updateData);

        // If update fails, return an error
        if (!updateData) {
            return res.status(500).json({ message: 'Could not update old refresh token' });
        }

        // Set new refresh token as HttpOnly cookie
        tokens.setRefreshCookie(res, refreshTokenData.refreshToken);
        
        return res.status(200).json({ message: 'Tokens refreshed', accessToken });
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        return res.status(500).json({ message: 'Error refreshing tokens' });
    }
},

//Update Account name and email
exports.updateAccountController = async (req, res) => {
    try {
        if(!req.body.accountName || !req.body.email || !req.user.id) {
            return res.status(400).json({ message: 'Not all fields filled out' });
        }

        console.log('updating account: ', req.params.accountId);
        console.log('with: ', req.body);
        const updatedAccountID = req.params.accountId;
        const updateInformation = req.body

        const userID = req.user.id

        if ((userID != updatedAccountID) && req.user.isAdmin === false) {
            return res.status(403).json({ message: 'Not authorized to update this account' });
        }

        // if no data inputed return 406 Not acceptable
        if ((!updateInformation.email || updateInformation.email === '') && (!updateInformation.accountName || updateInformation.accountName === '')) {
            return res.status(406).json({ message: "No data given"});
        }
        else if (!updateInformation.email || updateInformation.email === '') { // update only name if no email given
            const updatedAccountName = await accountModel.updateAccountNameModel(updatedAccountID, updateInformation);
            console.log('updatedAccount results1: ', updatedAccountName);
            return res.status(200).json({ message: 'account updated', updatedAccountName });
        }
        else if (!updateInformation.accountName || updateInformation.accountName === '') { // update only email if no name given
            const updatedAccountEmail = await accountModel.updateAccountEmailModel(updatedAccountID, updateInformation)
            console.log('updatedAccount results2: ', updatedAccountEmail);
            return res.status(200).json({ message: 'account updated', updatedAccountEmail});
        }
        else { // update both name and email
            const updatedAccountName = await accountModel.updateAccountNameModel(updatedAccountID, updateInformation);
            const updatedAccountEmail = await accountModel.updateAccountEmailModel(updatedAccountID, updateInformation);
            console.log('updatedAccount results3: ', updatedAccountName, updatedAccountEmail);
            return res.status(200).json({ message: 'account updated'});
        }
    } catch (error) {
        console.error('Error updating account: ', error);
        return res.status(500).json({ message: 'Error updating account'});
    }
}

//Delete account (sets isDeleted to true, will want logic on frontend to display "ACCOUNT DELETED" instead of username for their forums/threads/posts)
exports.deleteAccountController = async (req, res) => {
    try {
        if(!req.user.id || !req.params.accountId) {
            return res.status(400).json({ message: 'Not all fields provided' });
        }

        console.log('deleting account: ', req.params.accountId);
        const accountID = req.params.accountId;
        const requestAccountID = req.user.id;

        console.log(accountID);
        console.log(requestAccountID);

        if ((accountID != requestAccountID) && req.user.isAdmin === false) {
            return res.status(403).json({ message: 'Not authorized to delete this account' });
        }

        await accountModel.deleteAccountModel(accountID);

        await refreshTokenModel.revokeAllTokensByAccountIdModel(accountID);

        return res.status(200).json({ message: 'Account deleted'});

    } catch (error) {
        console.error ('Error deleting account: ', error);
        return res.status(500).json({ message: 'Error deleting account'});
    }
}

//Get account by ID
exports.getAccountController = async (req, res) => {
    try {
        console.log('Getting Account: ', req.params.accountId);
        const accountID = req.params.accountId;

        const accountInfo = await accountModel.getAccountModel(accountID);

        if (!accountInfo || accountInfo.length === 0) {
            return res.status(404).json({ message: 'Account not found'});
        }

        return res.status(200).json({ message: 'Account Sucessfully retrieved', accountInfo});

    } catch (error) {
        console.error ('Error getting account: ', error);
        return res.status(500).json({ message: 'Error getting account'});
    }
}