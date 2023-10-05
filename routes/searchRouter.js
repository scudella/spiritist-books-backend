const express = require('express');
const router = express.Router();
const {
  getBooks,
  getSingleBook,
} = require('../controllers/searchController.js');

router.route('/').get(getBooks);
router.route('/:id').get(getSingleBook);

module.exports = router;
