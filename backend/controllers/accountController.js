const accountModel = require('../models/accountModel');
const encryptionMiddleware = require('../middleware/bcrypt');

// Create a new account
//TODO: add check for existing account with same email
exports.createAccountController = async (req, res) => {
    try {
        console.log('account creation info: ', req.body);
        req.body.password = await encryptionMiddleware.hashPassword(req.body.password);
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
        const isPasswordValid = await encryptionMiddleware.checkPassword(req.body.password, accountInfo.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password (passwordMatch)' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
        console.error('Error logging in:', error);
    }
}