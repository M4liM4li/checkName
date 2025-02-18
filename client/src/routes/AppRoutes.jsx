import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../layouts/Layout";
import Login from "../pages/auth/Login";
import HomeTeacher from "../pages/teacher/HomeTeacher";
import ListStudent from "../pages/teacher/List";
import ScanStudent from "../pages/teacher/Scan";
import LayoutStudent from "../layouts/LayoutStudent";
import HomeStudent from "../pages/student/HomeStudent";
import LayoutTeacher from "../layouts/LayoutTeacher";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "/", element: <Login /> }],
  },
  {
    path: "/teacher",
    element: <LayoutTeacher />,
    children: [
      { index: true, element: <HomeTeacher /> },
      { path: "list-student", element: <ListStudent /> },
      { path: "scan-student", element: <ScanStudent /> },
    ],
  },

  {
    path: "/student",
    element: <LayoutStudent />,
    children: [{ index: true, element: <HomeStudent /> }],
  },
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
