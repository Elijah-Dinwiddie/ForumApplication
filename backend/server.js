const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

// Forum routes
app.use('/forums', require('./routes/forum'));
app.use('/accounts', require('./routes/account'));
app.use('/forums/:forumId/threads', require('./routes/thread'));
app.use('/forums/:forumId/threads/:threadId/posts', require('./routes/post'));

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


