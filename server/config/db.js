const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mern stack login'
});

db.connect(err => {
    if(err){
        throw err;
    }   
    console.log('Connecting to database');
});

module.exports = db;