import { useUser } from "@/hooks/useUser";
import React from "react";
import AppLayout from "./AppLayout";
import { Navigate, Outlet } from "react-router";
import Loader from "./Loader";

const ProtectedRoutes = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return (
      <AppLayout>
        <Outlet />;
      </AppLayout>
    );
  }

  console.info("ProtectLayout got user:", user);
  return <Navigate to={"/login"} replace />;
};
export default ProtectedRoutes;
