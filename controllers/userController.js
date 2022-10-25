const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');

exports.signupGet = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('signup');
};

exports.signupPost = [
  // Validation and sanitization
  body('firstname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a name.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric charaters on the name')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a last name.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric caraters on the last name.')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 5 })
    .withMessage('The username must have at least 5 characters.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric characters on the username.')
    .custom(async (value) => {
      const userCheck = await User.findOne({ username: value });
      if (userCheck !== null) {
        return Promise.reject();
      }
      return Promise.resolve();
    })
    .withMessage('Username already in use.')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('The password must have at least 6 characters.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric characters on the password.')
    .escape(),
  body('confirm-password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a confirm password.')
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation is incorrect');
      } else {
        return true;
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('signup', {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        errors: errors.array({ onlyFirstError: true }),
      });
    } else {
      // Success

      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const newUser = new User({
          first_name: req.body.firstname,
          last_name: req.body.lastname,
          username: req.body.username,
          password: hashedPassword,
        });

        newUser.save((error) => {
          if (error) {
            return next(error);
          }
        });

        res.redirect('/login');
      });
    }
  },
];

exports.loginGet = (req, res) => {
  res.render('login', {
    user: req.user ? req.user.toJSON() : null,
    error: req.flash('error'),
  });
};

exports.loginPost = [
  // Validation and sanitization
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a username')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a password')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', {
        username: req.body.username,
        errors: errors.array(),
      });
    }
    next();
  },
  // Authentication
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true,
  }),
];

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.becomeMemberGet = (req, res) => {
  res.render('member_form', {
    user: req.user.toJSON(),
  });
};

exports.becomeMemberPost = [
  // Validation and sanitization
  body('solution')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution')
    .custom((value) => {
      if (value === 'snow' || value === "'snow'") {
        return true;
      }
      throw new Error('Wrong. Try again');
    })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('member_form', {
        user: req.user.toJSON(),
        solution: req.body.solution,
        errors: errors.array({ onlyFirstError: true }),
      });
    } else {
      User.findByIdAndUpdate(
        req.body.userid,
        { membership_status: 'member' },
        {},
        (err) => {
          if (err) {
            return next(err);
          }
          req.flash('status', 'You are now a member !!!');
          res.redirect('/');
        }
      );
    }
  },
];

exports.becomeAdminGet = (req, res) => {
  res.render('admin_form', {
    user: req.user.toJSON(),
  });
};

exports.becomeAdminPost = [
  // Validation and sanitization
  body('solution-1')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution to the first problem.')
    .custom((value) => {
      if (value === 'undefined') {
        return true;
      }
      throw new Error('The first problem is wrong.');
    })
    .escape(),
  body('solution-2')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution to the second problem.')
    .custom((value) => {
      if (value === 'Two') {
        return true;
      }
      throw new Error('The second problem is wrong.');
    })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('admin_form', {
        user: req.user.toJSON(),
        solution: req.body.solution,
        errors: errors.array({ onlyFirstError: true }),
      });
    } else {
      User.findByIdAndUpdate(
        req.body.userid,
        { membership_status: 'admin' },
        {},
        (err) => {
          if (err) {
            return next(err);
          }
          req.flash('status', 'You are now an admin!!!');
          res.redirect('/');
        }
      );
    }
  },
];
