import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DocumentationLayout from '../components/layout/DocumentationLayout';
import GuestRoute from '../components/routing/GuestRoute';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CheckEmailPage from '../pages/CheckEmailPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ProfilePage from '../pages/ProfilePage';
import WorkspacePage from '../pages/WorkspacePage';
import VaultPage from '../pages/VaultPage';
import BenchmarksPage from '../pages/BenchmarksPage';
import CryptoLabPage from '../pages/CryptoLabPage';
import DocSectionPage from '../pages/docs/DocSectionPage';
import AdminPage from '../pages/AdminPage';
import AdminRoute from '../components/routing/AdminRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="lab" element={<CryptoLabPage />} />
        <Route path="docs" element={<DocumentationLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path=":sectionSlug" element={<DocSectionPage />} />
        </Route>
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="workspace"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vault"
          element={
            <ProtectedRoute>
              <VaultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="benchmarks"
          element={
            <ProtectedRoute>
              <BenchmarksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route path="check-email" element={<CheckEmailPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}
