const filterBooksByString = (books, property, bookString) => {
  const filteredBooks = books.filter((book) => {
    if (book[property]?.toLowerCase().includes(bookString.toLowerCase())) {
      return book;
    }
  });
  return filteredBooks;
};

const filterBooksByStringNumber = (books, property, bookString) => {
  const filteredBooks = books.filter((book) => {
    if (book[property]?.toString().includes(bookString)) {
      return book;
    }
  });
  return filteredBooks;
};

const filterBooksByArray = (books, property, bookString) => {
  const filteredBooks = books.filter((book) => {
    if (
      book[property]?.find((item) =>
        item.toLowerCase().includes(bookString.toLowerCase())
      )
    ) {
      return book;
    }
  });
  return filteredBooks;
};

function sortBooks(books, sort) {
  return books.sort((a, b) => {
    switch (sort) {
      case 'newest':
        if (+a.publishedYear > +b.publishedYear) {
          return -2;
        } else if (+a.publishedYear < +b.publishedYear) {
          return 0;
        }
        return -1;
      case 'oldest':
        if (+a.publishedYear < +b.publishedYear) {
          return -1;
        } else if (+a.publishedYear > +b.publishedYear) {
          return 1;
        }
        return 0;
      case 'a-z':
        if (a.title.localeCompare(b.title) === 1) {
          return 1;
        } else if (a.title.localeCompare(b.title) === -1) {
          return -1;
        }
        return 0;
      case 'z-a':
        if (a.title.localeCompare(b.title) === 1) {
          return -1;
        } else if (a.title.localeCompare(b.title) === -1) {
          return 1;
        }
        return 0;
      default:
        console.log('compare error');
    }
  });
}

module.exports = {
  filterBooksByString,
  filterBooksByStringNumber,
  filterBooksByArray,
  sortBooks,
};
