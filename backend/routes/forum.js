const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const auth = require('../middleware/auth.js');

// Route definitions
router.post ('/', auth, forumController.createForumController);
router.get('/', forumController.getPagForumsController);
router.get('/:forumId', forumController.getForumByIdController);
router.patch('/:forumId', auth, forumController.updateForumController);
router.delete('/:forumId', auth, forumController.deleteForumController);

module.exports = router;