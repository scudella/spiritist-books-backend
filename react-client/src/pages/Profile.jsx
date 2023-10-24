import { FormRow } from '../components';
import styled from 'styled-components';
import { useActionData, useOutletContext } from 'react-router-dom';
import { useNavigation, Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('avatar');
  if (file && file.size > 512000) {
    return { result: 'image too large' };
  }
  try {
    const response = await customFetch.patch('/users/update-user', formData);
    if (response.data.msg?.includes('email')) {
      return { result: 'email' };
    } else {
      return { result: 'updated' };
    }
  } catch (error) {
    return { result: 'error', error };
  }
};

const Profile = () => {
  const actionData = useActionData();
  const { user } = useOutletContext();
  const { name, lastName, email } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const { t } = useTranslation('profile');

  useEffect(() => {
    if (actionData?.result === 'image too large') {
      toast.error(t('Tamanho da imagem muito grande'));
    } else if (actionData?.result === 'email') {
      toast.success(t('Por favor verifique seu email para ativar a conta'));
    } else if (actionData?.result === 'updated') {
      toast.success(t('Perfil atualizado com sucesso'));
    } else if (actionData?.result === 'error') {
      toast.error(t(actionData.error?.response?.data?.msg));
    }
  }, [actionData]);

  return (
    <Wrapper>
      <Form method='post' className='form' encType='multipart/form-data'>
        <h4 className='form-title'>{t('perfil')}</h4>
        <div className='form-center'>
          <div className='form-row'>
            <label htmlFor='avatar' className='form-label'>
              {t('Selecione um arquivo de imagem (máx. 0.5 MB)')}
            </label>
            <input
              type='file'
              name='avatar'
              id='avatar'
              className='form-input'
              accept='image/*'
            />
          </div>
          <FormRow
            type='text'
            name='name'
            labelText={t('nome')}
            defaultValue={name}
          />
          <FormRow
            type='text'
            name='lastName'
            labelText={t('sobrenome')}
            defaultValue={lastName}
          />
          <FormRow
            type='email'
            name='email'
            labelText={t('Email (requer confirmação)')}
            defaultValue={email}
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
export default Profile;

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
