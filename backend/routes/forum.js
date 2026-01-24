const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// Route definitions
router.post ('/', forumController.createForum);
// router.get('/', forumController.getAllforums);
// router.get('/:forumId', forumController.getforumById);
// router.patch('/:forumId', forumController.updateforum);
// router.delete('/:forumId', forumController.deleteforum);

module.exports = router;