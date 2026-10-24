import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import StudentPortalPage from './pages/StudentPortalPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<VerifyPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/student" element={<StudentPortalPage />} />
                <Route path="/admin" element={<DashboardPage />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
