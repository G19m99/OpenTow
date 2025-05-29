import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import React from "react";
import { Navigate } from "react-router";
import { api } from "../../convex/_generated/api";
import AuthenticatedLayout from "./AuthenticatedLayout";

const Layout = () => {
  const userHasTenant = useQuery(api.core.tenant.userAssignedToTenant);
  const userRole = useQuery(api.core.permissions.getUserRoles);
  return (
    <React.Fragment>
      <Authenticated>
        <AuthenticatedLayout
          hasTenant={userHasTenant ?? false}
          roles={userRole}
        />
      </Authenticated>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
    </React.Fragment>
  );
};

export default Layout;
