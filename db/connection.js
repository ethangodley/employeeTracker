const mysql = require('mysql2/promise');

try{
    require('dotenv').config();
}catch(err){
    console.log(err);
}

function connect() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER,
        database: 'employee_tracker',
    })
}

module.exports = {connect};