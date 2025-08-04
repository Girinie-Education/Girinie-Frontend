//
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // return isLoggedIn ? children : <Navigate to="/login" replace />;
  //테스트 때문에 일단 주석처리

  return <>{children}</>;
}
