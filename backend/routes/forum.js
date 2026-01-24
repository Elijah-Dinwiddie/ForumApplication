const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// Route definitions
router.post ('/', forumController.createForumController);
router.get('/', forumController.getPagForumsController);
// router.get('/:forumId', forumController.getforumById);
// router.patch('/:forumId', forumController.updateforum);
// router.delete('/:forumId', forumController.deleteforum);

module.exports = router;