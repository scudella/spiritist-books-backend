import { toast } from 'react-toastify';
import { BookDetails } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { useContext, createContext, useEffect } from 'react';
import axiosError from '../utils/axiosError';

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/books/${params.id}`);
    return { loaderResult: 'success-loader', book: data.book };
  } catch (error) {
    const loaderMessage = axiosError(error);
    return { result: 'error-loader', loaderMessage };
  }
};

const SingleBookContext = createContext();

const SingleBook = () => {
  const { user } = useOutletContext();
  const { book, loaderResult, loaderMessage } = useLoaderData();

  useEffect(() => {
    if (loaderResult === 'error-loader') {
      toast.error(loaderMessage);
      navigate('/dashboard');
    }
  }, [loaderResult]);

  return (
    <SingleBookContext.Provider value={{ book }}>
      <BookDetails key={book.index} {...book} user={user} />
    </SingleBookContext.Provider>
  );
};

export const useSingleBookContext = () => useContext(SingleBookContext);

export default SingleBook;
