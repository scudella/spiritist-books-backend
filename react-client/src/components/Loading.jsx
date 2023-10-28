import styled from 'styled-components';

const Loading = () => {
  return (
    <Wrapper>
      <div className='loading'></div>
    </Wrapper>
  );
};
export default Loading;

const Wrapper = styled.div`
  .loading {
    margin: 0 auto;
    width: 6rem;
    height: 6rem;
    border: 5px solid var(--grey-400);
    border-radius: 50%;
    border-top-color: var(--primary-500);
    animation: spinner 0.6s linear infinite;
  }
`;
