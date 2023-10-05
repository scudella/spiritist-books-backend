const books = require('spiritist-books');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getBooks = async (req, res) => {
  let { query, tags } = req.query;
  let booksMatched;

  if (query) {
    query = query.toLowerCase();

    booksMatched = books.all.filter((book) => {
      if (
        tags === 'title' ||
        tags === 'originalPublisher' ||
        tags === 'publishedYear' ||
        tags === 'copyright' ||
        tags === 'currentPublisher'
      ) {
        if (book[tags].toLowerCase().includes(query)) {
          return book;
        }
      } else if (
        tags === 'authors' ||
        tags === 'spiritualAuthors' ||
        tags === 'yearPsychography' ||
        tags === 'isbn10' ||
        tags === 'isbn13'
      ) {
        return book[tags].find((tag) => tag.toLowerCase().includes(query));
      }
    });
  } else {
    booksMatched = books.all;
  }
  res.status(StatusCodes.OK).json({ data: booksMatched });
};

const getSingleBook = async (req, res) => {
  const { id } = req.params;

  const book = books.all.find((book) => `${book.index}` === id);

  if (!book) {
    throw new CustomError.NotFoundError(`No book with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ book });
};

module.exports = { getBooks, getSingleBook };
