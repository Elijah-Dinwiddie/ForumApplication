const threadModel = require('../models/threadModel');

exports.createThreadController = async (req, res) => {
    try {
        const forumID = req.params.forumId;
        const threadInfo = req.body
        const accountID = req.user.id

        console.log("This is the thread Info: ", threadInfo);
        console.log("This is the forumID: ", forumID);
        console.log('req user: ', req.user)
        const modelResponse = await threadModel.createThreadModel(forumID, threadInfo, accountID);

        console.log('the models response: ', modelResponse);

        res.status(200).json(modelResponse);
    } catch (error) {
        console.log('Error creating thread: ', error);
        res.status(500).json({ message: 'Error creating thread'});
    };
},

//TODO: Test Edge cases
exports.getPagThreadController = async (req, res) => {
    try {
        const threads = await threadModel.getPagThreadsModel((req.query.offset || 0), req.params.forumId)

        console.log('threads: ', threads);
        res.status(200).json( threads );
    } catch (error) {
        console.log('Error getting threads: ', error);
        res.status(500).json({ message: 'Error getting threads'});
    }
}

exports.getThreadById = async (req, res) => {
    try {
        const forumID = req.params.forumId;
        const threadID = req.params.threadId;
        const thread = await threadModel.getThreadById(forumID, threadID);

        if (thread === "" || !thread) {
            console.log('thread not found')
            return res.status(404).json({message: 'Thread not found'});
        }
        console.log('This is req params: ', req.params);
        res.status(200).json( thread );
    } catch (error) {
        console.log('Error getting thread: ', error);
        res.status(500).json({ message: 'Error getting thread'});
    }
}

exports.updateThreadController = async (req, res) => {
    try {
        const updateThread = req.body.threadPost;
        const threadID = req.params.threadId;
        const forumID = req.params.forumId;

        const oldInfo = await threadModel.getThreadById(forumID, threadID);

        console.log('user ID according to token: ', req.user.id);
        console.log('Old information: ', oldInfo);

        if(!oldInfo) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        // check user is the creator of thread
        if (oldInfo.created_by != req.user.id) {
            console.log('User not Authorized to update thread');
            return res.status(401).json({ message: 'Not authorized to update thread'});
        }

        // Check update information is provided
        if (!updateThread || updateThread === '') {
            console.log('No updated post provided');
            return res.status(400).json({message: 'No updated post provided'})
        }
        console.log('updateThread: ', updateThread);
        console.log('req.params: ', req.params);
        const updatedThread = await threadModel.updateThreadModel(updateThread, forumID, threadID);

        console.log(updatedThread);

        res.status(200).json( updatedThread );

    } catch (error) {
        console.log('Error updating thread: ', error);
        res.status(500).json({ message: 'Error updating thread'});
    }
}

exports.deleteThreadController = async (req, res) => {
    try {
        const threadInfo = await threadModel.getThreadById( req.params.forumId, req.params.threadId) || 'NULL';

        console.log('user ID according to token: ', req.user.id);
        console.log('thread information: ', threadInfo);

        //If thread is not found return 404 error
        if(threadInfo === 'NULL') {
            console.log('Thread not found in selected forum');
            return res.status(404).json({ message: 'Thread not found in selected Forum'});
        }

        // check user is the creator of thread
        if(threadInfo.created_by != req.user.id) {
            console.log('User not Authorized to delete thread');
            return res.status(401).json({ message: 'Not authorized to delete thread'});
        }

        const deletedThread = await threadModel.deleteThreadModel(req.params.forumId, req.params.threadId)
        console.log('Thread deleted: ', deletedThread);
        res.status(200).json({ message: 'Thread Deleted' });
    } catch (error) {
        console.log('Error deleting thread: ', error);
        res.status(500).json({ message: 'Error deleting thread'});
    }
}