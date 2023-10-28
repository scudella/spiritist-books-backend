const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
  checkForTestUser,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getApplicationStats,
} = require('../controllers/userController');

const { upload } = require('../middleware/multer');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router
  .route('/update-user')
  .patch(
    authenticateUser,
    checkForTestUser,
    upload.single('avatar'),
    updateUser
  );
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router
  .route('/admin/app-stats')
  .get(authenticateUser, authorizePermissions('admin'), getApplicationStats);
router.route('/:id').get(authenticateUser, getSingleUser); // needs to come last

module.exports = router;
