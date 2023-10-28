import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { useAllBooksContext } from '../pages/AllBooks';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageBtnContainer = () => {
  const {
    data: { nbPages, page: currentPage },
  } = useAllBooksContext();
  const pages = Array.from({ length: nbPages }, (_, index) => {
    return index + 1;
  });

  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation('book');

  const handlePageChange = (pageNumber) => {
    const searchparams = new URLSearchParams(search);
    searchparams.set('page', pageNumber);
    navigate(`${pathname}?${searchparams.toString()}`);
  };

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass && 'active'}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  };

  const renderPageButtons = () => {
    const pageButtons = [];

    // first page
    pageButtons.push(
      addPageButton({ pageNumber: 1, activeClass: currentPage === 1 })
    );

    // dots button
    if (currentPage > 3) {
      pageButtons.push(
        <span className='page-btn dots' key='dots-1'>
          ...
        </span>
      );
    }

    // the page before current page
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage - 1,
          activeClass: false,
        })
      );
    }
    // current page
    if (currentPage !== 1 && currentPage !== nbPages) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage,
          activeClass: true,
        })
      );
    }
    // the page after current page
    if (currentPage !== nbPages && currentPage !== nbPages - 1) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage + 1,
          activeClass: false,
        })
      );
    }

    // dots button
    if (currentPage < nbPages - 2) {
      pageButtons.push(
        <span className='page-btn dots' key='dots+1'>
          ...
        </span>
      );
    }

    // last page
    pageButtons.push(
      addPageButton({
        pageNumber: nbPages,
        activeClass: currentPage === nbPages,
      })
    );
    return pageButtons;
  };

  return (
    <Wrapper>
      <button
        className='btn prev-btn'
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) {
            prevPage = nbPages;
          }
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        {t('ant')}
      </button>
      <div className='btn-container'>{renderPageButtons()}</div>
      <button
        className='btn next-btn'
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > nbPages) {
            nextPage = 1;
          }
          handlePageChange(nextPage);
        }}
      >
        {t('post')}
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;

const Wrapper = styled.section`
  height: 6rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;
  .btn-container {
    background: var(--background-secondary-color);
    border-radius: var(--border-radius);
    display: flex;
  }
  .page-btn {
    background: transparent;
    border-color: transparent;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    border-radius: var(--border-radius);
    cursor: pointer;
  }
  .active {
    background: var(--primary-500);
    color: var(--white);
  }
  .prev-btn,
  .next-btn {
    background: var(--background-secondary-color);
    border-color: transparent;
    border-radius: var(--border-radius);

    width: 100px;
    height: 40px;
    color: var(--primary-500);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  .prev-btn:hover,
  .next-btn:hover {
    background: var(--primary-500);
    color: var(--white);
    transition: var(--transition);
  }
  .dots {
    display: grid;
    place-items: center;
    cursor: text;
  }
`;
