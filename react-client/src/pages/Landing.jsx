import { Link } from 'react-router-dom';
import styled from 'styled-components';
import main from '../assets/images/main.svg';
import { Logo } from '../components';
import { useTranslation, Trans } from 'react-i18next';

const Landing = () => {
  const { t } = useTranslation(['landing']);

  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div>
          <h1>
            <Trans i18nKey='landingTitle'>
              Livros <span>Espíritas</span>
            </Trans>
          </h1>
          <p>
            <Trans i18nKey='landingP'>
              Aqui você poderá consultar livros espíritas pelo autor, autor
              espirital e título. O intuito deste app é educacional e ser uma
              fonte de consulta rápida.
            </Trans>
          </p>
          <Link to='/register' className='btn register-link'>
            {t('Criar Conta')}
          </Link>
          <Link to='/login' className='btn'>
            Login / Demo
          </Link>
        </div>
        <img src={main} alt={t('Estante de Livros')} className='img main-img' />
      </div>
    </Wrapper>
  );
};

export default Landing;

const Wrapper = styled.section`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
    margin-bottom: 1.5rem;
  }
  p {
    line-height: 2;
    color: var(--text-secondary-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
  }
  .btn {
    padding: 0.75rem 1rem;
  }
  .logo {
    width: 11rem;
    height: 4rem;
    overflow: hidden;
    object-fit: cover;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
