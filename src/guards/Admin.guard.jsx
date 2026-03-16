import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AuthGuard from "./Auth.guard";

export default function AdminGuard({ children }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <AuthGuard>
      {user?.role === "Admin" || user?.role === "Sub Admin" ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </AuthGuard>
  );
}
