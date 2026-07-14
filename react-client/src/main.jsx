import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import i18n from './utils/i18n';
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading.jsx';

i18n.on('initialized', () => {
  console.log('#####');
  console.log('language: ', i18n.language);
  console.log('languages: ', i18n.languages);
  console.log('resolved: ', i18n.resolvedLanguage);
  console.log('i18 store data: ', i18n.store.data);
  console.log('navigator language: ', navigator.language);
  console.log('navigator languages: ', navigator.languages);
  console.log('localStorage lang: ', localStorage.getItem('i18nextLng'));
  console.log('document element lang: ', document.documentElement.lang);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
      <ToastContainer position='top-center' autoClose={3000} />
    </Suspense>
  </React.StrictMode>,
);
