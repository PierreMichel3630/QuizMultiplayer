import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}
export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth();
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
