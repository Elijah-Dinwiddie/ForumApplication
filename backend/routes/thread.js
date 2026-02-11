const express = require('express');
const router = express.Router({ mergeParams: true });
const threadController = require('../controllers/threadController.js');
const auth = require('../middleware/auth.js');

// route definitions
router.post('/', auth, threadController.createThreadController);

module.exports = router;