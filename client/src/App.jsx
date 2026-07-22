import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Transactions from "./admin/pages/Transactions";
import Analytics from "./admin/pages/Analytics";
import Users from "./admin/pages/Users";
import AlertsPage from "./admin/pages/AlertsPage";
import Login from "./pages/Login";

// Protected Route
function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("auth");
  return auth === "true" ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN (PROTECTED) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Nested Admin Pages */}
        <Route index element={<AdminDashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}