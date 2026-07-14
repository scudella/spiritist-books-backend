import { FaLocationArrow, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { IoStarOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { Link, Form } from 'react-router-dom';
import styled from 'styled-components';
import BookInfo from './BookInfo';
import { useTranslation } from 'react-i18next';
import { DeleteBook } from '../pages';

const Book = ({
  index,
  title,
  authors,
  spiritualAuthors,
  currentPublisher,
  publishedYear,
  user,
}) => {
  const { t } = useTranslation('book');

  return (
    <Wrapper>
      <header>
        <div className='link-container'>
          <div className='main-icon'>{authors[0].charAt(0)}</div>
          <Link to={`single-book/${index}/`} className='search-link'>
            <FaSearch />
          </Link>
        </div>
        <div></div>
        <div className='info'>
          <h5>{title}</h5>
          <p>{authors.join(', ')}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <BookInfo icon={<FaLocationArrow />} label={currentPublisher} />
          <BookInfo icon={<FaCalendarAlt />} label={publishedYear} />
          <BookInfo
            icon={<IoCheckmarkOutline />}
            label={
              spiritualAuthors.length === 1
                ? t('Autor(a) Espiritual')
                : t('Autores Espirituais')
            }
          />
          {spiritualAuthors.length > 0 && (
            <BookInfo
              icon={<IoStarOutline />}
              text={
                spiritualAuthors.length === 1
                  ? spiritualAuthors
                  : t('Espíritos Diversos')
              }
            />
          )}
        </div>
        {user.role === 'admin' && (
          <footer className='actions'>
            <Link to={`/dashboard/edit-book/${index}`} className='btn edit-btn'>
              {t('Editar')}
            </Link>
            <Form method='post' action={`delete-book/${index}`}>
              <button type='submit' className='btn delete-btn'>
                {t('Remover')}
              </button>
            </Form>
          </footer>
        )}
      </div>
    </Wrapper>
  );
};
export default Book;

const Wrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: grid;
  grid-template-rows: 1fr auto;
  box-shadow: var(--shadow-2);
  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--text-color);
    display: grid;
    grid-template-columns: 0.5fr 0.1fr 2fr;
    align-items: center;
    justify-content: space-between;
  }
  .link-container {
    position: relative;
    height: 60px;
    width: 60px;
    z-index: 1;
  }
  .search-link {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--primary-800);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: var(--transition);
    opacity: 0;
    cursor: pointer;
    font-size: 1.25rem;
    color: var(--white);
    z-index: 1;
  }
  header:hover .search-link {
    opacity: 1;
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--border-radius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.5rem;
      text-transform: none;
      color: var(--primary-800);
    }
    p {
      margin: 0;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }
  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    display: grid;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    align-items: center;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  .status {
    border-radius: var(--border-radius);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: center;
    width: 100px;
    height: 30px;
    display: grid;
    align-items: center;
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
  .edit-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  .edit-btn {
    margin-right: 0.5rem;
  }
`;
