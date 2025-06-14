import { useUser } from "@/hooks/useUser";
import React  from "react";
import AppLayout from "./AppLayout";
import { Navigate } from "react-router";

const ProtectedRoutes = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading user session...</div>;
  }

  if (user) {
    return <AppLayout />;
  }

  console.info("user", user)
  return <Navigate to={"/login"} replace />;
};
export default ProtectedRoutes;
