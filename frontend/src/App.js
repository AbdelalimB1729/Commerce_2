import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./pages_user/Home";
import About from "./pages_user/about";
import Contact from "./pages_user/Contact";
import Shop from "./pages_user/shop";
import Dashboard from "./pages_admin/Dashbord";
import ManageBooks from "./pages_admin/Managebooks";
import ManageUsers from "./pages_admin/Manageusers";
import ManageOrders from "./pages_admin/ManageOrders";
import Settings from "./pages_admin/Settings";
import ShoppingCart from "./pages_user/ShppingCard";
import AuthPage from "./AuthPages/Auth";

const AdminRoute = ({ children }) => {
  const isAdmin = Cookies.get("admin") === "true";

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const user = Cookies.get("user");

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <ShoppingCart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/manage-books",
    element: (
      <AdminRoute>
        <ManageBooks />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/manage-users",
    element: (
      <AdminRoute>
        <ManageUsers />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/manage-orders",
    element: (
      <AdminRoute>
        <ManageOrders />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <AdminRoute>
        <Settings />
      </AdminRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
