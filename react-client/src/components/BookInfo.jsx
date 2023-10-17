import styled from 'styled-components';

const BookInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className='book-icon'>{icon}</span>
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
  .book-text {
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
  }
`;
