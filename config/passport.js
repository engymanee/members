const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const verifyCallback = (username, password, done) => {
  User.findOne({ username }, (error, user) => {
    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, { message: 'User non exitent' });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) {
        return done(err);
      }
      if (res) {
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect password' });
    });
  });
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
