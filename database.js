const mysql = require('mysql');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'users'
});

db.connect((err) => {
   if (err) {
      console.log('Failed to Connect To MySQL Database');
      process.exit();
   }
   console.log('Connected to MySQL Database');
});

module.exports = db;