const express = require('express');
const router = express.Router();
const {
  getBooks,
  getSingleBook,
  addBook,
} = require('../controllers/BookController.js');

router.route('/').get(getBooks).post(addBook);
router.route('/:id').get(getSingleBook);

module.exports = router;
