import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthSkeleton } from '../../../shared/components/ui/Skeletons';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthSkeleton />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
