import { toast } from 'react-toastify';
import { BooksContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { useContext, createContext, useEffect } from 'react';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/books');
    return { result: 'success', data };
  } catch (error) {
    const message = error?.response?.data?.msg;
    return {
      result: 'error',
      message,
    };
  }
};

const AllBooksContext = createContext();

const AllBooks = () => {
  const { result, data, message } = useLoaderData();
  const { user } = useOutletContext();

  useEffect(() => {
    if (result === 'error') {
      toast.error(message);
    }
  }, [result]);

  return (
    <AllBooksContext.Provider value={{ data }}>
      <SearchContainer />
      <BooksContainer user={user} />
    </AllBooksContext.Provider>
  );
};

export const useAllBooksContext = () => useContext(AllBooksContext);

export default AllBooks;
