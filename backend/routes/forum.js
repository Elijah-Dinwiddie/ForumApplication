const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// Route definitions
router.post ('/', forumController.createForumController);
router.get('/', forumController.getPagForumsController);
router.get('/:forumID', forumController.getForumByIdController);
router.patch('/:forumId', forumController.updateforumController);
router.delete('/:forumId', forumController.deleteforumController);

module.exports = router;