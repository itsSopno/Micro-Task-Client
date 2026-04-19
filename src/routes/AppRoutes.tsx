import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: "",
        element: <DashboardHome />,
      }
    ]
  }
]);
