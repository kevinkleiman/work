const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./database.js');
const jwt = require('jsonwebtoken');
const verify = require('./verify_token');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Home Page
app.get('/', (req, res) => {
   res.render('index', {
      title: 'Home'
   })
});

// Handle Login
app.get('/login', (req, res) => {
   res.render('login', {
      title: 'Login'
   });
});

app.post('/login', (req, res) => {
   db.query("SELECT * FROM users_table WHERE Username = ?", [req.body.username], async (err, rows) => {
      if (err) {
         return res.status(400).send("No such Username");
      } else if (await bcrypt.compareSync(req.body.password, rows[0].Password)) {
         const token = jwt.sign({ _id: rows[0].Username }, process.env.SECRET);
         console.log(token);
         res.header('auth-token', token);
         res.redirect('/main_page');
      } else {
         return res.status(401).send("Password Incorrect");
      }
   })
});


// Handle Register
app.get('/register', (req, res) => {
   res.render('register', {
      title: 'Register'
   });
});

app.post('/register', async (req, res) => {
   res.render('register', {
      title: 'Register'
   });
   try {
      let hashed_password = await bcrypt.hashSync(req.body.password, 10);
      db.query("INSERT INTO users_table (Username, Password)" +
          "VALUES(?, ?)", [req.body.username, hashed_password], function(err, results, fields) {
            if (err) throw err;
         });
      db.query("SELECT * FROM users_table", (err, rows, fields) => {
         if (!!err) {
            throw err
         } else {
            console.log(rows)
         }
      });
      res.redirect('/login');
   } catch (e) {
      res.redirect('/register')
   }
});

app.get('/main_page', (req, res, next) => {
   const token = req.headers['auth-token'];
   if (!token) return res.status(401).send('Access Denied');
   try {
        jwt.verify(token, process.env.SECRET);
        console.log('Token Accepted');
        next();
    } catch (e) {
        res.status(400).send('Invalid Token');
    }
    res.render('main_page', {
      title: 'Logged In!'
   });
});


// Start Server
app.listen(3000, function () {
   console.log('Server Started...');
});
