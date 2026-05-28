import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CatalogPage } from '../modules/catalog/pages/CatalogPage';
import { ProductDetailsPage } from '../modules/catalog/pages/ProductDetailsPage';
import { HomePage } from '../modules/home/pages/HomePage';
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
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}
