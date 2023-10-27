const books = require('spiritist-books');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  filterBooksByString,
  filterBooksByStringNumber,
  filterBooksByArray,
  sortBooks,
} = require('../utils');
const BOOKSPERPAGE = 10;

const getBooks = async (req, res) => {
  let {
    title,
    authors,
    spiritualAuthors,
    originalPublisher,
    currentPublisher,
    publishedYear,
    page,
    sort,
  } = req.query;

  let booksMatched = books.all;

  if (
    title ||
    originalPublisher ||
    currentPublisher ||
    publishedYear ||
    authors ||
    spiritualAuthors
  ) {
    if (title) {
      booksMatched = filterBooksByString(booksMatched, 'title', title);
    }
    if (originalPublisher) {
      booksMatched = filterBooksByString(
        booksMatched,
        'originalPublisher',
        originalPublisher
      );
    }
    if (currentPublisher) {
      booksMatched = filterBooksByString(
        booksMatched,
        'currentPublisher',
        currentPublisher
      );
    }
    if (publishedYear) {
      booksMatched = filterBooksByStringNumber(
        booksMatched,
        'publishedYear',
        publishedYear
      );
    }
    if (authors) {
      booksMatched = filterBooksByArray(booksMatched, 'authors', authors);
    }
    if (spiritualAuthors) {
      booksMatched = filterBooksByArray(
        booksMatched,
        'spiritualAuthors',
        spiritualAuthors
      );
    }
  }

  if (sort) {
    booksMatched = sortBooks(booksMatched, sort);
  }

  const totalBooks = booksMatched.length;

  const nbPages = Math.ceil(booksMatched.length / BOOKSPERPAGE);

  page = isNaN(+page) ? 1 : +page;
  page = page > nbPages ? nbPages : page;
  page = page < 1 ? 1 : page;

  booksMatched = booksMatched.slice(
    BOOKSPERPAGE * (page - 1),
    page * BOOKSPERPAGE
  );

  res
    .status(StatusCodes.OK)
    .json({ books: booksMatched, nbPages, page, totalBooks });
};

const getSingleBook = async (req, res) => {
  const { id } = req.params;

  const book = books.all.find((book) => `${book.index}` === id);

  if (!book) {
    throw new CustomError.NotFoundError(`No book with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ book });
};

const addBook = async (req, res) => {
  console.log(req.body);
  res.status(StatusCodes.OK).json();
};

const editBook = async (req, res) => {
  console.log(req.body);
  res.status(StatusCodes.OK).json();
};

const deleteBook = async (req, res) => {
  console.log(req.params);
  res.status(StatusCodes.OK).json();
};

module.exports = { getBooks, getSingleBook, addBook, editBook, deleteBook };
