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
        res.status(201).json({ message: 'Post created'});
    } catch (error) {
        console.log('Error creating post: ', error);
        res.status(500).json({ message: 'Error creating post'});
    }
}

exports.getPagPostController = async (req, res) => {
    try {
        const threadID = req.params.threadId;
        const offset = req.query.offset;
        const posts = await postModel.getPagPostsModel((offset || 0), threadID)
        console.log('threadID: ', threadID);

        console.log('posts returned: ', posts);
        res.status(200).json( posts );
    } catch (error) {
        console.log('Error getting paginated posts', error);
        res.status(500).json({ message: 'Error getting paginated posts' });
    }
}

exports.getPostController = async (req, res) => {
    try {
        const threadID = req.params.threadId;
        const postID = req.params.postId;
        const post = await postModel.getPostModel(threadID, postID);

        if(!post || post == "") {
            return res.status(404).json({ message: 'post not found' });
        }

        console.log('post: ', post);
        res.status(200).json(post);
    } catch (error) {
        console.log('Error getting post', error);
        res.status(500).json({ message: 'Error getting post' });
    }
}