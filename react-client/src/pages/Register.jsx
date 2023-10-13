import { Form, redirect, useNavigation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormRow, Logo } from '../components';
import { useTranslation } from 'react-i18next';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration Successful');
    return redirect('/login'); // Only use redirect in action
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const { t } = useTranslation(['register']);

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>{t('Criar uma conta')}</h4>
        <FormRow
          type='text'
          name='name'
          labelText={t('nome')}
          defaultValue='edu'
        />
        <FormRow
          type='text'
          name='lastName'
          labelText={t('sobrenome')}
          defaultValue='liba'
        />
        <FormRow type='email' name='email' defaultValue='edu@gmail.com' />
        <FormRow
          type='password'
          name='password'
          labelText={t('senha')}
          defaultValue='secreto456'
        />
        <button type='submit' className='btn btn-block' disabled={isSubmitting}>
          {isSubmitting ? t('enviando...') : t('enviar')}
        </button>
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
