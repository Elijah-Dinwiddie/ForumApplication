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

exports.getPagThreadController = async (req, res) => {
    try {
        const threads = await threadModel.getPagThreadsModel(req.query.offset, req.params.forumId || 0)

        console.log('threads: ', threads);
        res.status(200).json( threads );
    } catch (error) {
        console.log('Error getting threads: ', error);
        res.status(500).json({ message: 'Error getting thread'});
    }
}