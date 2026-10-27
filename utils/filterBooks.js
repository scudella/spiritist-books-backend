export const filterBooksByString = (books, property, bookString) => {
  const normalizedQuery = removeAccents(bookString).toLowerCase();
  return books.filter((book) => {
    const normalizedBookString = removeAccents(book[property])?.toLowerCase();
    if (normalizedBookString?.includes(normalizedQuery)) {
      return book;
    }
  });
};

export const filterBooksByStringNumber = (books, property, bookString) => {
  return books.filter((book) => {
    if (book[property]?.toString().includes(bookString)) {
      return book;
    }
  });
};

export const filterBooksByArray = (books, property, bookString) => {
  let normalizedQuery = removeAccents(bookString).toLowerCase();
  normalizedQuery = mapAliases(normalizedQuery);

  return books.filter((book) => {
    if (
      book[property]?.find((item) =>
        removeAccents(item).toLowerCase().includes(normalizedQuery),
      )
    ) {
      return book;
    }
  });
};

export function sortBooks(books, sort) {
  if (sort === 'index') return books;
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

export function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function mapAliases(query) {
  return (
    query
      // Handle full name variant first
      .replace(/\bchico xavier\b/gi, 'francisco candido xavier')
      // Handle standalone 'chico'
      .replace(/\bchico\b/gi, 'francisco')
  );
}
