import { useSearchParams, Link } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Logo } from '../components';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accountVerified, setAccountVerified] = useState(false);
  const { t } = useTranslation(['verify']);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await customFetch.post('/auth/verify-email', {
          verificationToken: searchParams.get('token'),
          email: searchParams.get('email'),
        });
        toast.success(t('Conta Confirmada'));
        setAccountVerified(true);
      } catch (error) {
        const message = error?.response?.data?.msg;
        toast.error(t(message));
        setAccountVerified(false);
        return error;
      }
    };

    verifyToken();
  }, []);

  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <h2>{t('Verificação de Conta')}</h2>
        {accountVerified && (
          <Link to='/login' className='btn'>
            Login
          </Link>
        )}
      </div>
    </Wrapper>
  );
};

export default VerifyEmail;

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
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - var(--nav-height));
    margin-top: -3rem;
    flex-direction: column;
  }
  .logo {
    width: 11rem;
    height: 4rem;
    overflow: hidden;
    object-fit: cover;
  }
  h2 {
    font-weight: bold;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
  .btn {
    font-size: 1.5rem;
    padding: 0.75rem 2rem;
  }
`;
