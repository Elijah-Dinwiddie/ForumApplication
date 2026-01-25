const accountModel = require('../models/accountModel');
const encryptionMiddleware = require('../middleware/bcrypt');

// Create a new account
exports.createAccountController = async (req, res) => {
    try {
        console.log('account creation info: ', req.body);
        console.log('password before hashing: ', req.body.password);
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
}
