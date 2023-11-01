import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Admin,
  Error,
  AddBook,
  AllBooks,
  Profile,
  UserLayout,
  VerifyEmail,
  EditBook,
  DeleteBook,
} from './pages';
import ErrorElement from './components/ErrorElement';
import { addLibrary } from './utils/addLibrary';

import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as addBookAction } from './pages/AddBook';
import { action as editBookAction } from './pages/EditBook';
import { action as deleteBookAction } from './pages/DeleteBook';
import { action as profileAction } from './pages/Profile';

import { loader as dashboardLoader } from './pages/DashboardLayout';
import { loader as allBooksLoader } from './pages/AllBooks';
import { loader as editBookLoader } from './pages/EditBook';
import { loader as adminLoader } from './pages/Admin';
import { loader as loginLoader } from './pages/Login';
import { loader as registerLoader } from './pages/Register';

const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};

const isDarkThemeEnabled = checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        loader: registerLoader,
        action: registerAction,
      },
      {
        path: 'login',
        element: <Login />,
        loader: loginLoader,
        action: loginAction,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AllBooks />,
            loader: allBooksLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: 'add-book',
            element: <AddBook />,
            action: addBookAction,
            errorElement: <ErrorElement />,
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
            errorElement: <ErrorElement />,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
            errorElement: <ErrorElement />,
          },
          {
            path: 'edit-book/:id',
            element: <EditBook />,
            loader: editBookLoader,
            action: editBookAction,
            errorElement: <ErrorElement />,
          },
          {
            path: 'delete-book/:id',
            element: <DeleteBook />,
            action: deleteBookAction,
          },
        ],
      },
      {
        path: 'user',
        element: <UserLayout />,
        children: [
          {
            path: 'verify-email',
            element: <VerifyEmail />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />;
      {addLibrary('https://accounts.google.com/gsi/client')}
    </>
  );
}

export default App;
