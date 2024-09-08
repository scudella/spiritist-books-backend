import styled from 'styled-components';

const VerticalScrollMenu = ({ items, title, icon }) => {
  {
    return (
      <Wrapper>
        <ul>
          <li className='active'>
            {icon}
            {title}
          </li>
          {items.map((item, index) => {
            return <li key={index}> {item}</li>;
          })}
        </ul>
      </Wrapper>
    );
  }
};
export default VerticalScrollMenu;

const Wrapper = styled.div`
  width: 300px;
  max-height: 170px;
  overflow-y: auto;
  border-radius: var(--border-radius);

  li {
    background-color: var(--grey-100);
    color: var(--grey-600);
    display: block; /* Make the items appear below each other */
    padding: 12px;
    padding-left: 20px;
    letter-spacing: 2;
  }

  li:nth-child(even) {
    background-color: var(--grey-200);
  }

  li:hover {
    background-color: var(--primary-50);
  }

  li.active {
    background-color: var(--primary-500);
    color: var(--white);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    display: grid;
    grid-template-columns: 5px 200px;
    justify-content: space-around;
  }
`;
