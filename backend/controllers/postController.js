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

        if(post.is_deleted === 1) {
            return res.status(404).json({ message: 'post has been deleted' })
        }

        console.log('post: ', post);
        res.status(200).json(post);
    } catch (error) {
        console.log('Error getting post', error);
        res.status(500).json({ message: 'Error getting post' });
    }
}

//TODO: Allow admin to also update posts
exports.updatePostController = async (req, res) => {
    try {
        const isDeleted = req.body.isDeleted;
        const updateText = req.body.postText;
        const threadID = req.params.threadId;
        const postID = req.params.postId;
        const userID = req.user.id;
        let updatedPost;

        const oldPost = await postModel.getPostModel(threadID, postID)

        //Check user is creator of post
        if (oldPost.account_id !== req.user.id) {
            console.log('Usere is not creator of post');
            return res.status(401).json({ message: 'Not authorized to update Post'})
        }

        // Check both isDeleted and updateText is set
        if (!isDeleted && !updateText) {
            return res.status(400).json({ message: 'No update info provided' });
        }
        // Ensure only updateText or isDeleted is updated
        else if ((isDeleted !== 0 && isDeleted) && (updateText !== "" && updateText)) {
            return res.status(400).json({ message: 'Cannot update delete post and update text at same time'});
        }
        else if (updateText) {
            //logic to update text
            updatedPost = await postModel.updateTextModel(updateText, threadID, postID);
            console.log('Updated Post: ', updatedPost);
            return res.status(200).json(updatedPost);
        }
        else if (isDeleted === 0) {
            return res.status(400).json({ message: 'Can not currently undelete post'});
        }
        else if (isDeleted === 1) {
            //logic to soft delete post
            updatedPost = await postModel.deletePostModel(isDeleted, threadID, postID);
            console.log('Delted Post: ', updatedPost);
            return res.status(200).json({ message: 'Post Deleted' });
        }

        if (isDeleted !== (0 || 1)) {
            return res.status(400).json({ message: 'Incorrect format' });
        }

        return;

    } catch (error) {
        console.log('Error updating post', error)
        res.status(500).json({ message: 'Error updating post' });
    }
}