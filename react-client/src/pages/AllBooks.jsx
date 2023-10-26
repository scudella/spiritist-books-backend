import { toast } from 'react-toastify';
import { BooksContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { useContext, createContext, useEffect } from 'react';
import axiosError from '../utils/axiosError';

export const loader = async ({ request }) => {
  let params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  let reset = false;

  // upon clicking the clean up button, clean the machine state
  if (params.reset) {
    params = {};
    // ask the searchContainer to finish the reset cleaning up the url
    reset = true;
  }

  if (params?.sort === 'mais recente') {
    params.sort = 'newest';
  } else if (params?.sort === 'mais antigo') {
    params.sort = 'oldest';
  }

  try {
    const { data } = await customFetch.get('/books', { params });
    return { result: 'success', reset, data, searchValues: { ...params } };
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
  const { reset } = loaderData;

  useEffect(() => {
    if (loaderData?.result === 'error') {
      toast.error(loaderData.message);
    }
  }, [loaderData]);

  const data = loaderData?.data ? loaderData.data : { books: [] };
  const { searchValues } = loaderData;

  return (
    <AllBooksContext.Provider value={{ data, searchValues }}>
      {/* Make searchContainer rerender with a prop */}
      <SearchContainer reset={reset} />
      <BooksContainer user={user} />
    </AllBooksContext.Provider>
  );
};

export const useAllBooksContext = () => useContext(AllBooksContext);

export default AllBooks;
