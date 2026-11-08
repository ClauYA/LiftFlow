// server.js
// set up ======================================================================
// get all the tools we need
require('dotenv').config();
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
//desetructuracion
const ObjectID     = mongoose.Types.ObjectId;
//library and open source
const passport     = require('passport');
const flash        = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const session      = require('express-session');

const liftflowdb = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/liftflowdb?retryWrites=true&w=majority`;

require('./config/passport')(passport);


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'rcbootcamp2021b', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//app.get('/', menuController.getAllPlatillos);
//app.use('/menu', require('./app/Routes/menuRoutes.js'));
//para el link activo del sidebar
app.use((req, res, next)=>{
  res.locals.currentPath = req.path;
  next();
});

// launch ======================================================================
async function start() {
  try {
    await mongoose.connect(liftflowdb);
    console.log('Conectando a db liftflow ^^');

    const db = mongoose.connection.db;
    require('./app/routes.js')(app, passport, db, ObjectID);

    app.listen(port, () => console.log('The magic happens on port ' + port));
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  }
}

start();
