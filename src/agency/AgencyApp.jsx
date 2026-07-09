import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AgencyAuthProvider } from './AgencyAuthContext';
import ProtectedRoute from './ProtectedRoute';
import AgencyLayout from './layout/AgencyLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Girls from './pages/Girls';
import Earnings from './pages/Earnings';

// Mounted at "/agency/*" in App.jsx. There is deliberately no visible link
// to this anywhere in the public site or the admin console — reaching it
// means typing /agency into the address bar.
export default function AgencyApp() {
  return (
    <AgencyAuthProvider>
      <Routes>
        <Route index element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AgencyLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="girls" element={<Girls />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="*" element={<Navigate to="/agency/dashboard" replace />} />
        </Route>
      </Routes>
    </AgencyAuthProvider>
  );
}
