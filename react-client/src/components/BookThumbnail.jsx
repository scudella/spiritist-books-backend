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
    height: 4rem;
    padding-right: 0.5rem;
  }
  @media (min-width: 800px) {
    .thumb {
      height: 6rem;
      max-height: 6rem;
    }
  }
`;
