const express = require('express');
const router = express.Router();
const passport = require('passport');
let User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;


//index
router.get('/', (req, res) => {
  console.log(res.locals.user + '\n\n\n');
  res.render('./index', {title: 'uBuy', user: res.locals.user});
});
//login
router.get('/login', (req, res) => {
    res.render('login');
});
//register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;

        //validation
        req.checkBody('username', 'Username must not be empty').notEmpty();
        req.checkBody('password', 'Password must not be empty').notEmpty();
        req.checkBody('password2', 'Passwords must match').equals(password);

        let errors = req.validationErrors();

        if (errors) {
            res.render('register', {
                errors: errors
            });
        }
        else {
          //checking for email and username are already taken
          User.findOne({
            username: {
              "$regex": "^" + username + "\\b", "$options": "i"
            }
          }, function (err, user) {
            if (user) {
              res.render('register', {
                user: user,
              });
            }
            else {
              var newUser = new User({
                username: username,
                password: password
              });
              User.createUser(newUser, function (err, user) {
                if (err) throw err;
                console.log(user);
              });
              req.flash('success_msg', 'You are registered and can now login');
              res.redirect('/login');
            }
          });
        }
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          console.log("Found user... loggin in?/// " + user.username + "\n\n\n\n\n");
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true}),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', function (req, res) {
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/login');
});

module.exports = router;