const express = require('express');
const router = express.Router();
const {
  getBooks,
  getSingleBook,
  addBook,
  editBook,
} = require('../controllers/BookController.js');

router
  .route('/')
  .get(getBooks)
  .post(authenticateUser, authorizePermissions('admin'), addBook)
  .patch(authenticateUser, authorizePermissions('admin'), editBook);
router.route('/:id').get(getSingleBook);

module.exports = router;
