const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const router = require('express-promise-router')();
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://AlexMorgan:morgan11@ds121289.mlab.com:21289/socket');

// Mongoose schemas

const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
app.use(cookieParser());
app.use(validator());
app.use(session({
  secret: 'the secret key',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(router);

require('./models/User');

require('./passport/passport-local');

const users = require('./controllers/users');

users.setRouting(router);

server.listen(3000, () => {
  console.log('Server is running at port 3000');
});