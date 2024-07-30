import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import Home from './components/home/Home';
import Dashboard from './components/home/Dashboard';
import CourseList from './components/home/CourseList';
import Course from './components/home/Course';

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
    children: [
      {
        path: "/home",
        element: <Dashboard />,
      },
      {
        path: "/home/courses",
        element: <CourseList />,
      },
      {
        path: "/home/courses/:course_id",
        element: <Course />,
      },
    ],
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
