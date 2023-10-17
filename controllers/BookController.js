const books = require('spiritist-books');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const BOOKSPERPAGE = 10;

const getBooks = async (req, res) => {
  let { query, tags, page } = req.query;
  let booksMatched;

  if (query) {
    query = query.toLowerCase();

    booksMatched = books.all.filter((book) => {
      if (
        tags === 'title' ||
        tags === 'originalPublisher' ||
        tags === 'currentPublisher'
      ) {
        if (book[tags] && book[tags].toLowerCase().includes(query)) {
          return book;
        }
      } else if (tags === 'publishedYear' || tags === 'copyright') {
        if (book[tags] && book[tags] == query) {
          return book;
        }
      } else if (tags === 'authors' || tags === 'spiritualAuthors') {
        return book[tags].find((tag) => tag.toLowerCase().includes(query));
      }
    });
  } else {
    booksMatched = books.all;
  }
  const nbPages = Math.ceil(booksMatched.length / BOOKSPERPAGE);

  page = page ? +page : 0;

  page = page >= nbPages ? nbPages - 1 : page;

  page = page < 0 ? 0 : page;

  booksMatched = booksMatched.slice(
    BOOKSPERPAGE * page,
    (page + 1) * BOOKSPERPAGE
  );

  res.status(StatusCodes.OK).json({ books: booksMatched, nbPages, page });
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

module.exports = { getBooks, getSingleBook, addBook, editBook };
