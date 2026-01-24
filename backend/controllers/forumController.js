const forumModel = require('../models/forumModel.js');

// Create a new forum
exports.createForumController = async (req, res) => {
    try {
        console.log('Creating forum with data:', req.body);
        // Logic to create a forum
        const forumDetails = await forumModel.createForumModel(req.body);
        res.status(201).json(forumDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error creating forum', error });
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
        res.status(500).json({ message: 'Error fetching forums', error });
        console.error('Error fetching forums:', error);
    }
},

// Retrieve a forum by ID
exports.getForumByIdController = async (req, res) => {
    try {
        console.log('Fetching forum with ID: ', req.params.forumID);
        const forum = await forumModel.getForumByIdModel(req.params.forumID);
        res.status(200).json(forum);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forum', error });
        console.error('Error fetching forum:', error);
    }
}