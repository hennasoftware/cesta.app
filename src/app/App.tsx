import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../modules/admin/components/ProtectedRoute';
import { AdminDashboardPage } from '../modules/admin/pages/AdminDashboardPage';
import { AdminLoginPage } from '../modules/admin/pages/AdminLoginPage';
import { CatalogPage } from '../modules/catalog/pages/CatalogPage';
import { ProductDetailsPage } from '../modules/catalog/pages/ProductDetailsPage';
import { HomePage } from '../modules/home/pages/HomePage';
import { NotFoundPage } from '../modules/not-found/pages/NotFoundPage';
import { AppLayout } from '../shared/components/layout/AppLayout';

export function App() {
  const location = useLocation();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/produto/:slug" element={<ProductDetailsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}
