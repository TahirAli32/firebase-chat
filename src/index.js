import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from "./stores/authContext";
import { MessagesContextProvider } from './stores/messagesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MessagesContextProvider>
        <App />
      </MessagesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)