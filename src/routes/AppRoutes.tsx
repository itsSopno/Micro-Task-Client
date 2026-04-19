import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import AddTask from "../pages/Dashboard/AddTask";
import MyTasks from "../pages/Dashboard/MyTasks";
import TaskToReview from "../pages/Dashboard/TaskToReview";
import PurchaseCoin from "../pages/Dashboard/PurchaseCoin";
import PaymentHistory from "../pages/Dashboard/PaymentHistory";
import TaskList from "../pages/Dashboard/TaskList";
import MySubmissions from "../pages/Dashboard/MySubmissions";
import Withdrawals from "../pages/Dashboard/Withdrawals";
import TaskDetails from "../pages/Dashboard/TaskDetails";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import WithdrawRequests from "../pages/Dashboard/WithdrawRequests";
import AdminManageTasks from "../pages/Dashboard/AdminManageTasks";
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
