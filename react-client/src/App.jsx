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
} from './pages';

import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as addBookAction } from './pages/AddBook';

import { loader as dashboardLoader } from './pages/DashboardLayout';
import { loader as allBooksLoader } from './pages/AllBooks';

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
          },
          {
            path: 'admin',
            element: <Admin />,
          },
          {
            path: 'edit-book',
            element: <EditBook />,
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
