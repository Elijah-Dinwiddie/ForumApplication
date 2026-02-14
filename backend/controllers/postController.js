const postModel = require('../models/postModel');

//TODO: implement post number feature or remove it from database
exports.createPostController = async (req, res) => {
    try {
        console.log('request params: ', req.params);
        const userID = req.user.id;
        const threadID = req.params.threadId;
        const post = req.body.postText;
        const createdPost = await postModel.createPostModel(userID, threadID, post);

        console.log('Post created: ', createdPost);
        res.status(200).json({ message: 'Post created'});
    } catch (error) {
        console.log('Error creating post: ', error);
        res.status(500).json({ message: 'Error creating post'});
    }
}