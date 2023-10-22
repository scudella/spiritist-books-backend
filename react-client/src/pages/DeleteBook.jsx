import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useNavigate, useActionData } from 'react-router-dom';
import axiosError from '../utils/axiosError';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/books/${params.id}`);
    return { result: 'success' };
  } catch (error) {
    const message = axiosError(error);
    return { result: 'error', message };
  }
};

const DeleteBook = () => {
  const actionData = useActionData();
  const navigate = useNavigate();
  const { t } = useTranslation(['book']);

  useEffect(() => {
    if (actionData.result === 'success') {
      toast.success(t('Livro removido com sucesso'));
    } else if (actionData.result === 'error') {
      toast.error(t(actionData.message));
    }
    navigate('/dashboard');
  }, [actionData]);
};

export default DeleteBook;
