import { Navigate, useLocation, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  enabled?: boolean;
  tokenKey?: string;
}

const ProtectedRoute = ({ enabled = true, tokenKey = 'accessToken' }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!enabled) {
    return <Outlet />;
  }

  const token = localStorage.getItem(tokenKey);
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
