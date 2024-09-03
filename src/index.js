import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from "./AppContext"
import { AuthProvider } from "./AuthContext"

// user authentication and event ownership
// toggle view?

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
  //</React.StrictMode>
);