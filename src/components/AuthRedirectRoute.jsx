import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirectRoute = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/lite-operator-task-simulator/library" replace /> : <Outlet />;
};

export default AuthRedirectRoute;