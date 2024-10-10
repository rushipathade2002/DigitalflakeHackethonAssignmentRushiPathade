import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from './pages/store/Auth';
import { Home } from "./pages/Home"
import { Login } from './pages/Login';
import { ErrorPage } from './pages/ErrorPage';
import { Category } from './pages/Category';
import { AddCategory } from './pages/AddCategory';
import { Logout } from './pages/Logout';
import { SubCategory } from './pages/SubCategory';
import { EditCategory } from './pages/EditCategory';
import { Products } from './pages/Products';
import { AddSubCategory } from './pages/AddSubCategory';
import { AddProduct } from './pages/AddProduct';
import { EditSubCategory } from './pages/EditSubCategory';
import { EditProduct } from './pages/EditProduct';
import ProtectedRoute from './ProtectedRoute';

const isAuthenticated = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    index: true,
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/category', element: <Category /> },
      { path: '/add-category', element: <AddCategory /> },
      { path: '/subcategory', element: <SubCategory /> },
      { path: '/edit-category/:id', element: <EditCategory /> },
      { path: '/edit-subcategory/:id', element: <EditSubCategory /> },
      { path: '/edit-product/:id', element: <EditProduct /> },
      { path: '/add-subcategory', element: <AddSubCategory /> },
      { path: '/add-product', element: <AddProduct /> },
      { path: '/products', element: <Products /> },
      { path: '/logout', element: <Logout /> },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
