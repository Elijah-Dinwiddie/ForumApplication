const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const auth = require('../middleware/auth.js');

// Route definitions
router.post('/', accountController.createAccountController);
router.post('/login', accountController.loginAccountController);
router.post('/refresh', accountController.refreshController);
router.patch('/:accountId', auth, accountController.updateAccountController);
router.delete('/:accountId', auth, accountController.deleteAccountController);


module.exports = router;