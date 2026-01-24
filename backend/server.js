const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Forum routes
app.use('/forums', require('./routes/forum'));

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


