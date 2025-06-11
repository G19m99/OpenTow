import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import { Navigate } from "react-router";
import AuthenticatedLayout from "./AuthenticatedLayout";

const Layout = () => {
  return (
    <React.Fragment>
      <Authenticated>
        <AuthenticatedLayout />
      </Authenticated>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
    </React.Fragment>
  );
};

export default Layout;
