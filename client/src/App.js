import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import Home from './components/home/Home';

const router = createBrowserRouter([

  // Authentication
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
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
    //children: [],
  }

]);

function App() {
  useEffect(() => {
    console.log("App useEffect");
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
