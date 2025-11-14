import { FaLocationArrow, FaCalendarAlt } from 'react-icons/fa';
import { IoStarOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { Link, Form } from 'react-router-dom';
import styled from 'styled-components';
import BookInfo from './BookInfo';
import { useTranslation } from 'react-i18next';
import VerticalScrollMenu from './VerticalScrollMenu';
import { BookThumbnail } from '.';

const BookDetails = ({
  index,
  title,
  authors,
  spiritualAuthors,
  originalPublisher,
  currentPublisher,
  publishedYear,
  copyright,
  yearPsychography,
  isbn10,
  isbn13,
  originalCover,
  currentCover,
  user,
}) => {
  const { t } = useTranslation('book');

  return (
    <Wrapper>
      <header>
        <div className='main-icon box1'>{authors[0].charAt(0)}</div>
        <div className='info box2'>
          <h5>{title}</h5>
          <p>{authors.toString()}</p>
        </div>
        <div className='box3'>
          {spiritualAuthors.length === 1 ? (
            <VerticalScrollMenu
              items={spiritualAuthors}
              title={t('Autor(a) Espiritual')}
              icon={<IoStarOutline />}
            />
          ) : (
            <VerticalScrollMenu
              items={spiritualAuthors}
              title={t('Autores Espirituais')}
              icon={<IoStarOutline />}
            />
          )}
        </div>
        <div className='boxPlaceHolder'></div>
        <div className='box4'>
          {originalCover && <BookThumbnail src={originalCover} />}
          <div className='box5'>
            {currentCover && <BookThumbnail src={currentCover} />}
          </div>
        </div>
      </header>

      <div className='content'>
        <div className='content-center'>
          <BookInfo
            icon={<FaLocationArrow />}
            text={`${t('editora atual')} : ${currentPublisher}`}
          />
          <BookInfo
            icon={<FaLocationArrow />}
            text={`${t('editora original')} : ${originalPublisher}`}
          />
          <BookInfo
            icon={<FaCalendarAlt />}
            text={`${t('ano da publicação')} : ${publishedYear}`}
          />
          <BookInfo
            icon={<FaCalendarAlt />}
            text={`${
              yearPsychography.length !== 1
                ? t('ano(s) da psicografia')
                : t('ano da psicografia')
            } : ${yearPsychography.join(' / ')}`}
          />
          <BookInfo
            icon={<FaCalendarAlt />}
            text={`Copyright : ${copyright ? copyright : publishedYear}`}
          />
          <BookInfo
            icon={<IoCheckmarkOutline />}
            text={`ISBN-10 : ${isbn10.join(` / `)}`}
          />
          <BookInfo
            icon={<IoCheckmarkOutline />}
            text={`ISBN-13 : ${isbn13.join(' / ')}`}
          />
        </div>
        {user.role === 'admin' && (
          <footer className='actions'>
            <Link to={`/dashboard/edit-book/${index}`} className='btn edit-btn'>
              {t('Editar')}
            </Link>
            <Form method='post' action={`/dashboard/delete-book/${index}`}>
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
export default BookDetails;

const Wrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: grid;
  box-shadow: var(--shadow-2);
  max-width: 350px;
  @media (min-width: 800px) {
    max-width: 880px;
  }

  header {
    padding: 1rem 1rem;
    border-bottom: 1px solid var(--text-color);
    display: grid;
    grid-template-columns: 0.25fr 1.75fr;
    gap: 2rem;
    grid-column-gap: 1.2rem;
  }

  .box1 {
    position: absolute;
    left: -999em;
  }
  .box2 {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
    margin-top: 1rem;
  }
  .box3 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    justify-self: center;
  }
  .box4 {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
    width: 3.5rem;
    margin-top: 0.5rem;
  }
  .box5 {
    visibility: collapse;
  }
  .boxPlaceHolder {
    visibility: collapse;
  }

  @media (min-width: 800px) {
    header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--text-color);
      display: grid;
      grid-template-columns: 0.25fr 0.75fr 1fr;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    .box1 {
      position: relative;
      left: 0em;
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 2;
    }
    .box2 {
      grid-column-start: 2;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 2;
    }
    .box3 {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 3;
    }
    .box4 {
      grid-column-start: 2;
      grid-column-end: 3;
      grid-row-start: 2;
      grid-row-end: 3;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
      width: 15rem;
    }
    .boxPlaceHolder {
      visibility: visible;
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 2;
      grid-row-end: 3;
    }
    .box5 {
      visibility: visible;
    }
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
    font-size: 0.8rem;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
      font-size: 1rem;
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
