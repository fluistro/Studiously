import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';

// Components
import { LoginPage, SignupPage, DashboardPage, CourseListPage, CoursePage, Home } from './components/pages/Pages';

const router = createBrowserRouter([

  // Authentication
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
        element: <DashboardPage />,
      },
      {
        path: "/home/courses",
        element: <CourseListPage />,
      },
      {
        path: "/home/courses/:course_id",
        element: <CoursePage />,
      },
    ],
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
