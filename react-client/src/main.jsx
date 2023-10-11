import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './utils/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback='...is loading'>
      <App />
    </Suspense>
  </React.StrictMode>
);
