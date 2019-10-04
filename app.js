const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '1234',
   database: 'users'
}, (res, err) => {
   console.log('success')
});


app.get('/', function(req, res) {
   res.render('index', {
      title: 'Articles'
   });
});

app.get('/articles/add', function(req, res) {
   res.render('add_article', {
       title:'Add Article'
   })
});

app.listen(3000, function () {
   console.log('Server Started...')
});
