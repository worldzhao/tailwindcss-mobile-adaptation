import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.documentElement.style.setProperty('--tpx', `${100 / 375}vw`);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
