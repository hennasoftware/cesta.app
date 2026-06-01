import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';
import mobileHeroImage from '../assets/heroMobile.jpg';
import logoImage from '../assets/logo-ui.png';
import { ProtectedRoute } from '../modules/admin/components/ProtectedRoute';
import { AppLayout } from '../shared/components/layout/AppLayout';
import { Loading } from '../shared/components/ui/Loading';

const initialAssets = [heroImage, mobileHeroImage, logoImage];

const HomePage = lazy(() => import('../modules/home/pages/HomePage').then((module) => ({ default: module.HomePage })));
const CatalogPage = lazy(() => import('../modules/catalog/pages/CatalogPage').then((module) => ({ default: module.CatalogPage })));
const ProductDetailsPage = lazy(() => import('../modules/catalog/pages/ProductDetailsPage').then((module) => ({ default: module.ProductDetailsPage })));
const AdminLoginPage = lazy(() => import('../modules/admin/pages/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('../modules/admin/pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));
const NotFoundPage = lazy(() => import('../modules/not-found/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export function App() {
  const location = useLocation();
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let active = true;

    async function boot() {
      const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, 850));
      const fontReady = document.fonts?.ready ?? Promise.resolve();

      await Promise.all([minimumDelay, fontReady, ...initialAssets.map(preloadImage)]);

      if (active) {
        setIsBooting(false);
      }
    }

    boot();

    return () => {
      active = false;
    };
  }, []);

  if (isBooting) {
    return <Loading label="Carregando sistema..." />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<Loading label="Carregando tela..." />}>
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
      </Suspense>
    </AppLayout>
  );
}
