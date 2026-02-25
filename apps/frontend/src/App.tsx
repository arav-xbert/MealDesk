import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { LunchSelectionPage } from './pages/LunchSelectionPage';
import { SubmittedPage } from './pages/SubmittedPage';
import { DashboardPage, OverviewTab, EditMealsTab } from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />

          {/* Any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/lunch-selection" element={<LunchSelectionPage />} />
            <Route path="/submitted" element={<SubmittedPage />} />
          </Route>

          {/* HR only */}
          <Route element={<ProtectedRoute requiredRole="HR" />}>
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewTab />} />
              <Route path="edit-meals" element={<EditMealsTab />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
