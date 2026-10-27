
module.exports = function(app, passport, db, ObjectID) {
  const Athlete = require('./models/athlete');
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, async function(req, res) {
    try {
      //const menu = await Menu.find();
      db.collection('messages').find().toArray((err, result) => {
        if (err) {return console.log(err);}
        res.render('profile.ejs', {
          user: req.user,
          messages: result,
          //menu
        });
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout(() => {
      console.log('User has logged out!');
    });
    res.redirect('/');
  });

  // Agregamos al atleta la cong de cuenta ===============================================================
  app.post('/athlete/account', isLoggedIn, async (req, res) => {
    try {
      const athlete = await Athlete.findOne({ user: req.user._id })
                      || new Athlete({ user: req.user._id });

      athlete.account = {
        role: req.body.role,
        language: req.body.language,
        unitSystem: req.body.unitSystem
      };
      await athlete.save();

      res.json({ ok: true, next: 'discipline' });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        for (const [path, e] of Object.entries(err.errors)) {
          errors[path.split('.').pop()] = e.message;
        }
        return res.status(400).json({ errors });
      }
      res.status(500).json({ error: err.message });
    }
  });
 
 

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
       
  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    const user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function() {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  {return next();}

  res.redirect('/');
}
