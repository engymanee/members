const router = require('express').Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const {
  isAuth,
  isAdmin,
  isViewer,
  isMember,
  isMemberOrAdmin,
} = require('./authMiddleware');

// Message routes
router.get('/', messageController.index);
router.get('/new-message', isAuth, messageController.newMessageGet);
router.post('/new-message', isAuth, messageController.newMessagePost);
router.get(
  '/edit-message/:id',
  isAuth,
  isMemberOrAdmin,
  messageController.editMessageGet
);
router.post(
  '/edit-message/:id',
  isAuth,
  isMemberOrAdmin,
  messageController.editMessagePost
);
router.get(
  '/delete-message/:id',
  isAuth,
  isAdmin,
  messageController.deleteMessageGet
);
router.post(
  '/delete-message/:id',
  isAuth,
  isAdmin,
  messageController.deleteMessagePost
);
router.post('/pin-message', isAuth, isAdmin, messageController.pinMessagePost);

// User routes
router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);
router.get('/become_member', isAuth, isViewer, userController.becomeMemberGet);
router.post(
  '/become_member',
  isAuth,
  isViewer,
  userController.becomeMemberPost
);
router.get('/become_admin', isAuth, isMember, userController.becomeAdminGet);
router.post('/become_admin', isAuth, isMember, userController.becomeAdminPost);

module.exports = router;
