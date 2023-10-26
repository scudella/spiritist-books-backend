import { FormRow, FormRowSelect } from '.';
import styled from 'styled-components';
import { Form, useSubmit } from 'react-router-dom';
import { BOOK_SORT_BY } from '../utils/constants';
import { useAllBooksContext } from '../pages/AllBooks';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const SearchContainer = ({ reset }) => {
  const { t } = useTranslation('addBook');
  const { searchValues } = useAllBooksContext();
  if (searchValues) {
    var {
      title,
      authors,
      spiritualAuthors,
      originalPublisher,
      currentPublisher,
      publishedYear,
      sort,
    } = searchValues;
  }
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };

  useEffect(() => {
    // Clean up the URL for the reset param
    if (reset) {
      const formData = new FormData();
      submit(formData);
    }
  }, [reset]);

  const initValues = () => {
    // Clean up the input fields
    Array.from(document.querySelectorAll('input')).forEach(
      (input) => (input.value = '')
    );
    // Clean up the select field
    Array.from(document.querySelectorAll('select'))[0].value =
      t('mais recente');

    // Message AllBooks page to reset the machine state
    const formData = new FormData();
    formData.append('reset', 'reset');
    submit(formData);
  };

  return (
    <Wrapper>
      <Form className='form'>
        <h5 className='form-title'>{t('consulta')}</h5>
        <div className='form-center'>
          <FormRow
            type='search'
            name='title'
            defaultValue={title}
            labelText={t('título')}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRow
            type='search'
            name='authors'
            defaultValue={authors}
            labelText={t('autor/a')}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRow
            type='search'
            name='spiritualAuthors'
            defaultValue={spiritualAuthors}
            labelText={t('autor / autora espiritual')}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRow
            type='search'
            name='originalPublisher'
            defaultValue={originalPublisher}
            labelText={t('editora original')}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRow
            type='search'
            name='currentPublisher'
            defaultValue={currentPublisher}
            labelText={t('editora atual')}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRow
            type='search'
            name='publishedYear'
            defaultValue={publishedYear}
            labelText={t('ano publicação')}
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRowSelect
            name='sort'
            defaultValue={sort}
            labelText={t('ordenar')}
            list={[...Object.values(BOOK_SORT_BY).map((item) => t(item))]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <button
            type='button'
            className='btn form-btn delete-btn'
            onClick={initValues}
          >
            {t('Limpar os valores da consulta')}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;

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
