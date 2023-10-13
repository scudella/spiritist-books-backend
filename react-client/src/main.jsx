import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './utils/i18n';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback='...is loading'>
      <App />
      <ToastContainer position='top-center' />
    </Suspense>
  </React.StrictMode>
);
