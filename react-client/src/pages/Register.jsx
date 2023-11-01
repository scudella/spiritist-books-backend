import { useEffect } from 'react';
import {
  Form,
  useNavigation,
  useNavigate,
  Link,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import styled from 'styled-components';
import { FormRow, Logo, GoogleButton } from '../components';
import { useTranslation } from 'react-i18next';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axiosError from '../utils/axiosError';

export const loader = async () => {
  try {
    const { data } = await customFetch.get(`/auth/show-web-id`);
    return { result: 'success', clientId: data.clientId };
  } catch (error) {
    const loaderMessage = axiosError(error);
    return { result: 'error-loader', message: loaderMessage };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (data.credential) {
    // google credentials; run login in the backend instead
    try {
      const result = await customFetch.post('/auth/login', data);
      if (result.statusText === 'Created') {
        return {
          result: 'success-reg-login',
        };
      } else {
        return {
          result: 'success-login',
        };
      }
    } catch (error) {
      const message = axiosError(error);
      return {
        result: 'error',
        message,
      };
    }
  } else {
    // regular register
    try {
      await customFetch.post('/auth/register', data);
      return {
        result: 'success-register',
      };
    } catch (error) {
      const message = axiosError(error);
      return {
        result: 'error',
        message,
      };
    }
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const navigate = useNavigate();
  const { t } = useTranslation(['register']);
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const clientId = loaderData?.clientId;

  useEffect(() => {
    if (actionData?.result === 'success-register') {
      toast.success(t('Conta criada com sucesso!'));
      toast.success(t('Por favor verifique seu email para ativar a conta'));
      navigate('/login');
    } else if (actionData?.result === 'success-reg-login') {
      toast.success(t('Conta criada com sucesso'));
      navigate('/dashboard');
    } else if (actionData?.result === 'success-login') {
      toast.success(t('Login realizado com sucesso'));
      navigate('/dashboard');
    } else if (actionData?.result === 'error') {
      toast.error(t(actionData.message));
    }
  }, [actionData]);

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>{t('Criar uma conta')}</h4>
        <FormRow type='text' name='name' labelText={t('nome')} />
        <FormRow type='text' name='lastName' labelText={t('sobrenome')} />
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' labelText={t('senha')} />
        <button type='submit' className='btn btn-block' disabled={isSubmitting}>
          {isSubmitting ? t('enviando...') : t('enviar')}
        </button>
        <GoogleButton clientId={clientId} register />
        <p>
          {t('Já tem conta')}?
          <Link to='/login' className='member-btn'>
            {t('Fazer Login')}
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;

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
