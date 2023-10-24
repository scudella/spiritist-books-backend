import { FormRow } from '../components';
import styled from 'styled-components';
import {
  useActionData,
  useNavigate,
  Form,
  useNavigation,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/books', data);
    return { result: 'success' };
  } catch (error) {
    return { result: 'error', message: error?.response?.data?.msg };
  }
};

const AddBook = () => {
  const navigation = useNavigation();
  const actionData = useActionData();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === 'submitting';
  const { t } = useTranslation('addBook');

  useEffect(() => {
    if (actionData?.result === 'success') {
      toast.success(t('Livro adicionado com sucesso'));
      navigate('/dashboard');
    } else if (actionData?.result === 'error') {
      toast.error(t(actionData.message));
    }
  }, [actionData]);

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>{t('adicionar livro')}</h4>
        <div className='form-center'>
          <FormRow type='text' name='title' labelText={t('título')} />
          <FormRow type='text' name='authors' labelText={t('autores')} />
          <FormRow
            type='text'
            labelText={t('autores espirituais')}
            name='spiritualAuthors'
          />
          <FormRow
            type='text'
            name='originalPublisher'
            labelText={t('editora original')}
          />
          <FormRow
            type='text'
            name='currentPublisher'
            labelText={t('editora atual')}
          />
          <FormRow
            type='text'
            name='publishedYear'
            labelText={t('ano publicação')}
          />
          <FormRow
            type='text'
            name='copyright'
            labelText={t('ano copyright')}
          />
          <button
            type='submit'
            className='btn btn-block form-btn'
            disabled={isSubmitting}
          >
            {isSubmitting ? t('enviando...') : t('enviar')}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddBook;

const Wrapper = styled.section`
  border-radius: var(--border-radius);
  width: 100%;
  background: var(--background-secondary-color);
  padding: 3rem 2rem 4rem;
  .form-title {
    margin-bottom: 2rem;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 1rem;
  }
  .form-btn {
    align-self: end;
    margin-top: 1rem;
    display: grid;
    place-items: center;
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;
