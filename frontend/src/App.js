import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import PartnerSignup from './pages/PartnerSignup';
import PartnerLogin from './pages/PartnerLogin';
import Vault from './pages/Vault';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPartners from './pages/admin/AdminPartners';
import AdminVault from './pages/admin/AdminVault';
import AdminHomepage from './pages/admin/AdminHomepage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Footer from './components/Footer';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isVault = location.pathname === '/vault';
  const isAdmin = location.pathname.startsWith('/admin');

  const showNavbar = !isHome && !isVault && !isAdmin;
  const showFooter = !isAdmin;

  return (
    <div className="App min-h-screen bg-white">
      {showNavbar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<PartnerSignup />} />
        <Route path="/partner" element={<PartnerSignup />} />
        <Route path="/login" element={<PartnerLogin />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="vault" element={<AdminVault />} />
          <Route path="homepage" element={<AdminHomepage />} />
        </Route>
        <Route path="/about" element={<div className="pt-24 p-8"><h1>About Us</h1><p>Coming soon...</p></div>} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/countries" element={<div className="pt-24 p-8"><h1>Countries</h1><p>Coming soon...</p></div>} />
        <Route path="/news" element={<div className="pt-24 p-8"><h1>News & Events</h1><p>Coming soon...</p></div>} />
        <Route path="/contact" element={<div className="pt-24 p-8"><h1>Contact</h1><p>Coming soon...</p></div>} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

