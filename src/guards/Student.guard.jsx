import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AuthGuard from "./Auth.guard";

export default function StudentGuard({ children }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <AuthGuard>
      {user ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </AuthGuard>
  );
}
