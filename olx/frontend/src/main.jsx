import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateAdPage from './pages/CreateAdPage';
import ListingDetailPage from './pages/ListingDetailPage';
import MyAdsPage from './pages/MyAdsPage';
import ProfilePage from './pages/ProfilePage';
import EmailVerificationPage from './pages/EmailVerificationPage';

const AppLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <WelcomePage /> },
      { path: 'ads', element: <HomePage /> },
      { path: 'ads/:listingId', element: <ListingDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'verify-email/:token', element: <EmailVerificationPage /> },
      { path: 'create-ad', element: <CreateAdPage /> },
      { path: 'edit-ad/:listingId', element: <CreateAdPage /> },
      { path: 'my-ads', element: <MyAdsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);