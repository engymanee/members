exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render('not_authorized', {
      user: req.user ? req.user.toJSON() : null,
      message: 'You need to have an account to do this.',
    });
  }
};

exports.isViewer = (req, res, next) => {
  if (req.user.membership_status === 'viewer') {
    next();
  } else {
    res.render('not_authorized', {
      user: req.user ? req.user.toJSON() : null,
      message: 'You need to be a viewer to do this.',
    });
  }
};

exports.isMember = (req, res, next) => {
  if (req.user.membership_status === 'member') {
    next();
  } else {
    res.render('not_authorized', {
      user: req.user ? req.user.toJSON() : null,
      message: 'You need to be a member to do this.',
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.membership_status === 'admin') {
    next();
  } else {
    res.render('not_authorized', {
      user: req.user ? req.user.toJSON() : null,
      message: 'You need to be an admin to do this.',
    });
  }
};

exports.isMemberOrAdmin = (req, res, next) => {
  if (
    req.user.membership_status === 'member' ||
    req.user.membership_status === 'admin'
  ) {
    next();
  } else {
    res.render('not_authorized', {
      user: req.user ? req.user.toJSON() : null,
      message: 'You need to be a member or an admin to do this.',
    });
  }
};
