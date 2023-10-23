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
        action: registerAction,
      },
      {
        path: 'login',
        element: <Login />,
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
          },
          {
            path: 'add-book',
            element: <AddBook />,
            action: addBookAction,
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: 'edit-book/:id',
            element: <EditBook />,
            loader: editBookLoader,
            action: editBookAction,
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
  return <RouterProvider router={router} />;
}

export default App;
