import React from "react";
import { getAuthWithExpiry } from "./manageToken";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = !!getAuthWithExpiry("token");

  return isLoggedIn === true ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
