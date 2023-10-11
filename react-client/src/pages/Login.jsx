import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormRow, Logo } from '../components';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation(['login']);

  return (
    <Wrapper>
      <form className='form'>
        <Logo />
        <h4>{t('Fazer Login')}</h4>
        <FormRow type='email' name='email' defaultValue='edu@gmail.com' />
        <FormRow
          type='password'
          name='password'
          labelText={t('senha')}
          defaultValue='secreto456'
        />
        <button type='submit' className='btn btn-block'>
          {t('enviar')}
        </button>
        <button type='button' className='btn btn-block'>
          {t('explore o app')}
        </button>
        <p>
          {t('Não tem conta ainda')}?
          <Link to='/register' className='member-btn'>
            {t('Criar Conta')}
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
    width: 11rem;
    height: 4rem;
    overflow: hidden;
    object-fit: cover;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
  }
  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    color: var(--primary-500);
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }
`;
