const sql = require('mssql');

//database configuration

let config = {
    user: 'sa',
    password: process.env.password,
    server: 'localhost',
    port: 1434,
    database: 'ForumApplication',
    options: {
        encrypt: false, 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {sql, poolPromise};