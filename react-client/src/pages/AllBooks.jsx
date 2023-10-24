import { toast } from 'react-toastify';
import { BooksContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { useContext, createContext, useEffect } from 'react';
import axiosError from '../utils/axiosError';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/books');
    return { result: 'success', data };
  } catch (error) {
    const message = axiosError(error);
    return {
      result: 'error',
      message,
    };
  }
};

const AllBooksContext = createContext();

const AllBooks = () => {
  const loaderData = useLoaderData();
  const { user } = useOutletContext();

  useEffect(() => {
    if (loaderData?.result === 'error') {
      toast.error(loaderData.message);
    }
  }, [loaderData]);

  const data = loaderData?.data ? loaderData.data : null;

  return (
    <AllBooksContext.Provider value={{ data }}>
      <SearchContainer />
      <BooksContainer user={user} />
    </AllBooksContext.Provider>
  );
};

export const useAllBooksContext = () => useContext(AllBooksContext);

export default AllBooks;
