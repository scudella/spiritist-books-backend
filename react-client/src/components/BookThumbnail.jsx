import styled from 'styled-components';

const BookThumbnail = ({ src }) => {
  return (
    <Wrapper>
      <img src={src} alt='book thumbnail' className='thumb' />
    </Wrapper>
  );
};
export default BookThumbnail;

const Wrapper = styled.div`
  .thumb {
    max-width: 100%;
    width: 4.5rem;
  }
`;
