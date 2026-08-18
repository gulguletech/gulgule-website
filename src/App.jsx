import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Download from './pages/Download';
import Privacy from './pages/Privacy';
import AdminApp from './admin/AdminApp';
import AgencyApp from './agency/AgencyApp';

export default function App() {
  // The admin console (mounted at /admin/*) and the agency console (mounted
  // at /agency/*) are reachable only by typing the URL — there's no link to
  // either anywhere in the public nav — and each has its own layout, so
  // neither should show the marketing site's navbar/footer.
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAgencyRoute = location.pathname.startsWith('/agency');
  const isConsoleRoute = isAdminRoute || isAgencyRoute;

  return (
    <>
      {!isConsoleRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/download" element={<Download />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/agency/*" element={<AgencyApp />} />
      </Routes>
      {!isConsoleRoute && <Footer />}
    </>
  );
}
//abdc