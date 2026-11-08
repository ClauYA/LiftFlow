// config/passport.js

// load all the things we need
const LocalStrategy   = require('passport-local').Strategy;

// load up the user model
const User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => done(null, user.id));

  // used to deserialize the user
  passport.deserializeUser(async (id, done) => {
    try{
      done(null, await User.findById(id));
    } catch (err){
      done(err);
    }
  });

 	// =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
        
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
      // if there are any errors, return the error
      if (err)
      {return done(err);}

      // check to see if theres already a user with that email
      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {

        // if there is no user with that email
        // create the user
        const newUser            = new User();
        console.log('BODY:', req.body); 
        // set the user's local credentials
        newUser.name            = req.body.name;
        newUser.local.email    = email;
        newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
        console.log('USER ANTES DE GUARDAR:', newUser); 
        // save the user
        newUser.save(function(err) {
          if (err)
          {return done(err);}
          return done(null, newUser);
        });
      }

    });

  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true
  }, async (req, email, password, done)=>{
    try{
      const user = await User.findOne({'local.email':email});
      if(!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      return done(null, user);
    } catch (err){
      return done(err);
    }
  }));

};
