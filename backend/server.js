const config = require('./config/configuration');
const express = require('express');
const app = express();
const sql = require('mssql');
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/forums', require('./routes/forum'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


