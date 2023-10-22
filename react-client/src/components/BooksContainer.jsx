import Book from './Book';
import styled from 'styled-components';
import { useAllBooksContext } from '../pages/AllBooks';
import { useTranslation } from 'react-i18next';

const BooksContainer = ({ user }) => {
  const { data } = useAllBooksContext();
  const { books, nbPages, page } = data;
  const { t } = useTranslation('book');

  if (books.length === 0) {
    return (
      <Wrapper>
        <h2>{t('Não há livros para mostrar...')}</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className='books'>
        {books.map((book) => {
          return <Book key={book.index} {...book} user={user} />;
        })}
      </div>
    </Wrapper>
  );
};
export default BooksContainer;

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  .books {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 1120px) {
    .books {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }
`;