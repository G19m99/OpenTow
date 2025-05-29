import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import React from "react";
import { Navigate, Outlet } from "react-router";
import { api } from "../../convex/_generated/api";
import MobileNavbar from "./MobileNavbar";
import Navbar from "./Navbar";

const Layout = () => {
  const userRole = useQuery(api.core.permissions.getUserRoles);
  return (
    <React.Fragment>
      <Authenticated>
        <div className="h-screen w-screen overflow-hidden box-border">
          <Navbar />
          {userRole ? (
            <React.Fragment>
              <Outlet />
              <MobileNavbar userRoles={[userRole]} />
            </React.Fragment>
          ) : (
            <div className="text-center text-red-500 font-medium">
              No role assigned please contact site admin
            </div>
          )}
        </div>
      </Authenticated>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
    </React.Fragment>
  );
};

export default Layout;
