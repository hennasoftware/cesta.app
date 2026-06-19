import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RouteSkeleton } from '../shared/components/ui/Skeletons';

const PublicRoutes = lazy(() => import('./PublicRoutes').then((module) => ({ default: module.PublicRoutes })));
const AdminRoutes = lazy(() => import('../modules/admin/AdminRoutes').then((module) => ({ default: module.AdminRoutes })));

export function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<PublicRoutes />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
