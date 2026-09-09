import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/admin/DashboardPage.jsx';
import { DriversPage } from './pages/admin/DriversPage.jsx';
import { VehiclesPage } from './pages/admin/VehiclesPage.jsx';
import { RoutesPage } from './pages/admin/RoutesPage.jsx';
import { DeliveriesPage } from './pages/admin/DeliveriesPage.jsx';
import { DriverViewPage } from './pages/driver/DriverViewPage.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';

export const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute allowedRole="admin">
                  <DriversPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute allowedRole="admin">
                  <VehiclesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/routes"
              element={
                <ProtectedRoute allowedRole="admin">
                  <RoutesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/deliveries"
              element={
                <ProtectedRoute allowedRole="admin">
                  <DeliveriesPage />
                </ProtectedRoute>
              }
            />

            {/* Driver Route */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute>
                  <DriverViewPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
