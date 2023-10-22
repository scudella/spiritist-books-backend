const express = require('express');
const router = express.Router();
const {
  getBooks,
  getSingleBook,
  addBook,
  editBook,
  deleteBook,
} = require('../controllers/BookController.js');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getBooks)
  .post(authenticateUser, authorizePermissions('admin'), addBook);

router
  .route('/:id')
  .get(getSingleBook)
  .patch(authenticateUser, authorizePermissions('admin'), editBook)
  .delete(authenticateUser, authorizePermissions('admin'), deleteBook);

module.exports = router;
