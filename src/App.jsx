import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Download from './pages/Download';
import AdminApp from './admin/AdminApp';

export default function App() {
  // The admin console (mounted at /admin/*, reachable only by typing the
  // URL — there's no link to it anywhere in the public nav) has its own
  // layout and shouldn't show the marketing site's navbar/footer.
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/download" element={<Download />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}
//abdc