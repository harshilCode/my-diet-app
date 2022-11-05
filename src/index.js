import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import './assets/main.css';
import packageJson from '../package.json'

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log(packageJson.version)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();