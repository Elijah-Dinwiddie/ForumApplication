const forumModel = require('../models/forumModel.js');

exports.createForum = async (req, res) => {
    try {
        console.log('Creating forum with data:', req.body);
        // Logic to create a forum
        const forumDetails = await forumModel.createForum(req.body);
        res.status(201).json(forumDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error creating forum', error });
        console.error('Error creating forum:', error);
    }
}