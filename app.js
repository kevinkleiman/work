const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
   res.render('index', {title: 'hello'});
});

app.listen(3000, function () {
   console.log('Server Started...')
});
