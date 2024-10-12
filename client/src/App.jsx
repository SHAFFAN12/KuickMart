import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './pages/Public/redux/store';
import Layout from './pages/Layout';
import Layout2 from './pages/Layout2';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import ProductDetails from './pages/Public/ProductDetail';
import GoogleLogin from './pages/Public/GoogleLogin';
import Cart from './pages/Public/Cart';
import Checkout from './pages/Public/Checkout';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageProducts from './pages/Admin/product/Product';
import ManageOrders from './pages/Admin/orders/ManageOrders';
import ManageUsers from './pages/Admin/users/ManageUsers';
import AdminCategories from './pages/Admin/Categories';
import AdminAuth from './pages/Admin/auth/Auth';
import Promotions from './pages/Admin/promotions/Promotions';
import OrderHistory from './pages/Public/OrderHistory';
import AdminRewardPolicies from './pages/Admin/AdminReward';
import CustomerRewards from './pages/Public/Reward';
import Aboutus from './pages/Aboutus';
import Terms from './pages/Terms';
import Products from './pages/Products';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import PublicRoute from './PublicRoute';
import CustomerDashboard from './pages/Public/CustomerDashboard';

const App = () => {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId='943329293469-dnkb9eebrmcqclo2njqcfkc9nc3b5ldb.apps.googleusercontent.com'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            {/* <Route path="/" element={<Layout2 />}> */}
              <Route index element={<PublicRoute element={<Home />} />} />
              <Route path="/product-details/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
              <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
              <Route path="login" element={<PublicRoute element={<GoogleLogin />} />} />
              <Route path="order-history" element={<ProtectedRoute element={<OrderHistory />} />} />
              <Route path="customer-dashboard" element={<ProtectedRoute element={<CustomerDashboard />} />} />
              <Route path="rewards" element={<ProtectedRoute element={<CustomerRewards />} />} />
              <Route path="about" element={<Aboutus />} />
              <Route path="terms" element={<Terms />} />
              <Route path="products" element={<Products />} />
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<ProtectedRoute element={<AdminDashboard />} isAdminRoute={true} />} />
              <Route path="products" element={<ProtectedRoute element={<ManageProducts />} isAdminRoute={true} />} />
              <Route path="orders" element={<ProtectedRoute element={<ManageOrders />} isAdminRoute={true} />} />
              <Route path="users" element={<ProtectedRoute element={<ManageUsers />} isAdminRoute={true} />} />
              <Route path="promotions" element={<ProtectedRoute element={<Promotions />} isAdminRoute={true} />} />
              <Route path="rewards" element={<ProtectedRoute element={<AdminRewardPolicies />} isAdminRoute={true} />} />
              <Route path="categories" element={<ProtectedRoute element={<AdminCategories />} isAdminRoute={true} />} />
            </Route>
            <Route path="admin/auth" element={<AdminAuth />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  );
};

export default App;







// https://console.cloud.google.com/apis/credentials?project=kuickmart