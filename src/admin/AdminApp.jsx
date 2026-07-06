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
import Transactions from './pages/Transactions';
import Calls from './pages/Calls';

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
          <Route path="transactions" element={<Transactions />} />
          <Route path="calls" element={<Calls />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
