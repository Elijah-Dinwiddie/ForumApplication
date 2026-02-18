const express = require('express');
const router = express.Router({ mergeParams: true });
const postController = require('../controllers/postController.js');
const auth = require('../middleware/auth.js');

router.post('/', auth, postController.createPostController);
router.get('/', postController.getPagPostController);

module.exports = router;