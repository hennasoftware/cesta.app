import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../shared/components/layout/PublicLayout';
import { RouteSkeleton } from '../shared/components/ui/Skeletons';

const HomePage = lazy(() => import('../modules/home/pages/HomePage').then((module) => ({ default: module.HomePage })));
const CatalogPage = lazy(() => import('../modules/catalog/pages/CatalogPage').then((module) => ({ default: module.CatalogPage })));
const ProductDetailsPage = lazy(() => import('../modules/catalog/pages/ProductDetailsPage').then((module) => ({ default: module.ProductDetailsPage })));
const NotFoundPage = lazy(() => import('../modules/not-found/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

export function PublicRoutes() {
  return (
    <PublicLayout>
      <Suspense fallback={<RouteSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/produto/:slug" element={<ProductDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </PublicLayout>
  );
}
