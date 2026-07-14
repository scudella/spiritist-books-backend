import styled from 'styled-components';

const BookInfo = ({ icon, label, text }) => {
  return (
    <Wrapper>
      <span className='book-icon'>{icon}</span>
      {label && <span className='book-label'>{label}</span>}
      <span className='book-text'>{text}</span>
    </Wrapper>
  );
};
export default BookInfo;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  .book-icon {
    font-size: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    svg {
      color: var(--text-secondary-color);
    }
  }
  .book-label {
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    padding: 0.125rem;
    padding-right: 0.5rem;
    font-size: 0.85rem;
    margin-right: 0.2rem;
    color: var(--primary-600);
    white-space: nowrap;
  }
  .book-text {
    letter-spacing: var(--letter-spacing);
    font-size: 0.8rem;
    line-height: 1.5;
  }
`;
