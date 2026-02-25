import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { LunchSelectionPage } from './pages/LunchSelectionPage';
import { SubmittedPage } from './pages/SubmittedPage';
import { DashboardPage, OverviewTab, EditMealsTab } from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/lunch-selection" element={<LunchSelectionPage />} />
        <Route path="/submitted" element={<SubmittedPage />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewTab />} />
          <Route path="edit-meals" element={<EditMealsTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
