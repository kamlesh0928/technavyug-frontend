import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AuthGuard from "./Auth.guard";

export default function InstructorGuard({ children }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <AuthGuard>
      {user?.role === "Instructor" ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </AuthGuard>
  );
}
