import { FormRow } from '../components';
import styled from 'styled-components';
import { useActionData, useLoaderData } from 'react-router-dom';
import { Form, useNavigation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import axiosError from '../utils/axiosError';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/books/${params.id}`);
    return { loaderResult: 'success-loader', book: data.book };
  } catch (error) {
    const loaderMessage = axiosError(error);
    return { result: 'error-loader', loaderMessage };
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const authors = data.authors;
  data.authors = authors.split(',').map((author) => author.trim());

  const spiritualAuthors = data.spiritualAuthors;
  data.spiritualAuthors = spiritualAuthors
    .split(',')
    .map((author) => author.trim());

  const yearPsychography = data.yearPsychography;

  data.yearPsychography = yearPsychography
    .split(',')
    .map((year) => year.trim());

  const isbn10 = data.isbn10;
  data.isbn10 = isbn10.split(',').map((isbn) => isbn.trim());

  const isbn13 = data.isbn13;
  data.isbn13 = isbn13.split(',').map((isbn) => isbn.trim());

  console.log(data);
  try {
    await customFetch.patch(`/books/${params.id}`, data);
    return { result: 'success-action' };
  } catch (error) {
    const message = axiosError(error);
    return { result: 'error-action', message };
  }
};

const EditBook = () => {
  const { book, loaderResult, loaderMessage } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const navigate = useNavigate();
  const { t } = useTranslation('book');

  useEffect(() => {
    if (loaderResult === 'error-loader') {
      toast.error(loaderMessage);
      navigate('/dashboard');
    }
  }, [loaderResult]);

  useEffect(() => {
    if (actionData?.result === 'success-action') {
      toast.success(t('Livro editado com sucesso'));
      navigate('/dashboard');
    }
    if (actionData?.result === 'error-action') {
      toast.error(actionData.message);
      return actionData.message;
    }
  }, [actionData]);

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className='form-title'>{t('Editar o livro')}</h4>
        <div className='form-center'>
          <FormRow
            type='text'
            name='title'
            defaultValue={book.title}
            labelText={t('título')}
          />
          <FormRow
            type='text'
            name='authors'
            labelText={
              book.authors.length === 1 ? t('Autor(a)') : t('Autores(as)')
            }
            defaultValue={book.authors}
          />
          <FormRow
            type='text'
            name='spiritualAuthors'
            labelText={
              book.spiritualAuthors.length === 1
                ? t('Autor(a) Espiritual')
                : t('Autores Espirituais')
            }
            defaultValue={book.spiritualAuthors}
          />
          <FormRow
            type='text'
            name='originalPublisher'
            labelText={t('editora original')}
            defaultValue={book.originalPublisher}
          />
          <FormRow
            type='text'
            name='currentPublisher'
            labelText={t('editora atual')}
            defaultValue={book.currentPublisher}
          />
          <FormRow
            type='text'
            name='publishedYear'
            labelText={t('ano da publicação')}
            defaultValue={book.publishedYear}
          />
          <FormRow
            type='text'
            name='yearPsychography'
            labelText={
              book.yearPsychography.length === 1
                ? t('ano da psicogragia')
                : t('ano(s) da psicografia')
            }
            defaultValue={book.yearPsychography}
          />
          <FormRow
            type='text'
            name='copyright'
            labelText='copyright'
            defaultValue={book.copyright}
          />
          <FormRow
            type='text'
            name='isbn10'
            labelText='ISBN 10'
            defaultValue={book.isbn10}
          />
          <FormRow
            type='text'
            name='isbn13'
            labelText='ISBN 13'
            defaultValue={book.isbn13}
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
export default EditBook;

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
