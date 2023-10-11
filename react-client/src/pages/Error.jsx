import { Link, useRouteError } from 'react-router-dom';
import styled from 'styled-components';
import img from '../assets/images/not-found.svg';
import { useTranslation } from 'react-i18next';

const Error = () => {
  const { t } = useTranslation(['error']);
  const error = useRouteError();

  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={img} alt={t('não encontrada')} />
          <h3>{t('Página não encontrada')}!</h3>
          <p>
            {t('parece que não encontramos a página que você está procurando')}
          </p>
          <Link to='./dashboard'>{t('página inicial')}</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div>
        <h3>{t('alguma coisa saiu errada')}</h3>
      </div>
    </Wrapper>
  );
};

export default Error;

const Wrapper = styled.main`
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 90vw;
    max-width: 600px;
    display: block;
    margin-bottom: 2rem;
    margin-top: -3rem;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    line-height: 1.5;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-secondary-color);
  }
  a {
    color: var(--primary-500);
    text-transform: capitalize;
  }
`;
