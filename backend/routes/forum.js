const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const auth = require('../middleware/auth.js');

// Route definitions
router.post ('/', auth, forumController.createForumController);
router.get('/', forumController.getPagForumsController);
router.get('/:forumID', forumController.getForumByIdController);
router.patch('/:forumId', forumController.updateforumController);
router.delete('/:forumId', forumController.deleteforumController);

module.exports = router;