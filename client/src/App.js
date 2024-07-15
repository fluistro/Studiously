import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';

const router = createBrowserRouter([

  // Authentication
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // Home
  {
    path: "/home",
    element: <Home />,
    children: [],
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
