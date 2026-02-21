const forumModel = require('../models/forumModel.js');

// Create a new forum
exports.createForumController = async (req, res) => {
    try {
        const accountID = req.user.id

        console.log('Creating forum with data:', req.body);
        // Logic to create a forum
        const forumDetails = await forumModel.createForumModel(req.body, accountID);
        res.status(201).json(forumDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error creating forum' });
        console.error('Error creating forum:', error);
    }
}

// Retrieve forums with pagination
exports.getPagForumsController = async (req, res) => {
    try {
        console.log('Fetching forums with offset: ', req.query.offset);
        const forums = await forumModel.getPagForumsModel(req.query.offset || 0);
        console.log('Forums fetched: ', forums);
        res.status(200).json(forums);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forums' });
        console.error('Error fetching forums:', error);
    }
},

// Retrieve a forum by ID
exports.getForumByIdController = async (req, res) => {
    try {
        console.log('Fetching forum with ID: ', req.params.forumID);
        const forum = await forumModel.getForumByIdModel(req.params.forumID);

        if(!forum) {
            console.log('Forum not found');
            return res.status(404).json({ message: 'Forum not found' });
        }
        res.status(200).json(forum);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forum' });
        console.error('Error fetching forum:', error);
    }
},

// Update forum by ID
// TODO: Maybe make it to where only the forum description can be changed. if not make checks for if part of form is null/blank
exports.updateforumController = async (req, res) => {
    try {
        const userID = req.user.id;
        const oldForum = await forumModel.getForumByIdModel(req.params.forumId);

        if(oldForum.created_by != userID) {
            console.log('Not authorized to update forum');
            return res.status(401).json({ message: 'Not authorized to update forum' });
        }

        console.log('Updating forum with ID: ', req.params.forumId, ' with data: ', req.body);
        const updatedForum = await forumModel.updateForumModel(req.params.forumId, req.body);
        res.status(200).json(updatedForum);
    } catch (error) {
        res.status(500).json({ message: 'Error updating forum' });
        console.error('Error updating forum:', error);
    }
},

// Delete forum by ID
exports.deleteforumController = async (req, res) => {
    try {
        const userID = req.user.id;
        const oldForum = await forumModel.getForumByIdModel(req.params.forumId);
        console.log(userID)
        console.log(oldForum.created_by)

        if(oldForum.created_by != userID) {
            console.log('Not authorized to delete forum');
            return res.status(401).json({ message: 'Not authorized to delete forum' });
        }

        console.log('Deleting forum with ID: ', req.params.forumId);
        const deletedForum = await forumModel.deleteForumModel(req.params.forumId);
        res.status(200).json(deletedForum);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting forum' });
        console.error('Error deleting forum:', error);
    }
}