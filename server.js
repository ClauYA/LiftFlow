// server.js
// set up ======================================================================
// get all the tools we need
require('dotenv').config();
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
//desetructuracion
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
//library and open source
const passport = require('passport');
const flash    = require('connect-flash');

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
//const menuController = require('./app/controllers/menuController.js');


const liftflowdb = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/liftflowdb`;

// configuration ===============================================================
mongoose.connect(liftflowdb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err)=>{
  if (err) {
    return console.log(err.message);}
  console.log('Conectando a db liftflow ^^');
  const db = mongoose.connection.db;
  require('./app/routes.js')(app, passport, db, ObjectID);

}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'rcbootcamp2021b', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//app.get('/', menuController.getAllPlatillos);
//app.use('/menu', require('./app/Routes/menuRoutes.js'));

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
