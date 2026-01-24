const config = require('./config/configuration');
const express = require('express');
const app = express();
const sql = require('mssql');
const port = 3000;

app.use('/forums', require('./routes/forum'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


