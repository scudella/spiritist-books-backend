import express from 'express';
import { upload } from '../middleware/multer.js';
import {
  authenticateUser,
  authorizePermissions,
  checkForTestUser,
} from '../middleware/authentication.js';
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getApplicationStats,
} from '../controllers/userController.js';

const router = express.Router();

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

export default router;
