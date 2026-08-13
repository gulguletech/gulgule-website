import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Verifications from './pages/Verifications';
import Recharges from './pages/Recharges';
import Withdrawals from './pages/Withdrawals';
import Transactions from './pages/Transactions';
import Calls from './pages/Calls';
import Pricing from './pages/Pricing';
import Agencies from './pages/Agencies';
import AgencyDetail from './pages/AgencyDetail';

// Mounted at "/admin/*" in App.jsx. There is deliberately no visible link
// to this anywhere in the public site — reaching it means typing /admin
// into the address bar.
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route index element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="verifications" element={<Verifications />} />
          <Route path="recharges" element={<Recharges />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="calls" element={<Calls />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="agencies" element={<Agencies />} />
          <Route path="agencies/:id" element={<AgencyDetail />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
