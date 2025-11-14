import express from 'express';
import {
  getBooks,
  getSingleBook,
  addBook,
  editBook,
  deleteBook,
} from '../controllers/BookController.js';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authentication.js';

const router = express.Router();

router
  .route('/')
  .get(getBooks)
  .post(authenticateUser, authorizePermissions('admin'), addBook);

router
  .route('/:id')
  .get(getSingleBook)
  .patch(authenticateUser, authorizePermissions('admin'), editBook)
  .delete(authenticateUser, authorizePermissions('admin'), deleteBook);

export default router;
