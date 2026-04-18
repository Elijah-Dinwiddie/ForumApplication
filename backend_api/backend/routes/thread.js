const express = require('express');
const router = express.Router({ mergeParams: true });
const threadController = require('../controllers/threadController.js');
const auth = require('../middleware/auth.js');

// route definitions
router.post('/', auth, threadController.createThreadController);
router.get('/', threadController.getPagThreadController);
router.get('/:threadId', threadController.getThreadById);
router.patch('/:threadId', auth, threadController.updateThreadController);
router.delete('/:threadId', auth, threadController.deleteThreadController);

module.exports = router;