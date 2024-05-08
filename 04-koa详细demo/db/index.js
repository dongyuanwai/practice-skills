const mysql = require('mysql')

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "koa_test",
    port: 3306
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID  Success!', connection.threadId);
});

module.exports = connection
