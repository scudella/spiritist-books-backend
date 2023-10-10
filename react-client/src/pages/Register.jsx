import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormRow, Logo } from '../components';

const Register = () => {
  return (
    <Wrapper>
      <form className='form'>
        <Logo />
        <h4>Criar uma conta</h4>
        <FormRow type='text' name='name' labelText='nome' defaultValue='edu' />
        <FormRow
          type='text'
          name='lastname'
          labelText='sobrenome'
          defaultValue='liba'
        />
        <FormRow type='email' name='email' defaultValue='edu@gmail.com' />
        <FormRow
          type='password'
          name='passsword'
          labelText='senha'
          defaultValue='secreto456'
        />
        <button type='submit' className='btn btn-block'>
          enviar
        </button>
        <p>
          Já tem conta?
          <Link to='/login' className='member-btn'>
            Fazer Login
          </Link>
        </p>
      </form>
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
