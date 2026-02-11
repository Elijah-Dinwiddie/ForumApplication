const threadModel = require('../models/threadModel');

exports.createThreadController = async (req, res) => {
    try {
        const forumID = req.params.forumId;
        const threadInfo = req.body
        const accountID = req.user.id

        console.log("This is the thread Info: ", threadInfo);
        console.log("This is the forumID: ", forumID);
        const modelResponse = await threadModel.createThreadModel(forumID, threadInfo, accountID);

        console.log('the models response: ', modelResponse);

        res.status(200).json(modelResponse);
    } catch (error) {
        console.log('Error creating thread: ', error);
        res.status(500).json({ message: 'Error creating thread'});
    };
}