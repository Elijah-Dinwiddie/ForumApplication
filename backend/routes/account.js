const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');

// Route definitions
router.post('/', accountController.createAccountController);
router.post('/login', accountController.loginAccountController);

module.exports = router;