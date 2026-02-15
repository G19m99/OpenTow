import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { AdminDashboard } from "./AdminDashboard";
import { DispatcherDashboard } from "./DispatcherDashboard";
import { DriverDashboard } from "./DriverDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";

const Dashboard = () => {
  const currentUserRoles = useQuery(
    api.features.users.queries.getCurrentUserRoles
  );

  if (!currentUserRoles) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (currentUserRoles.includes("admin")) {
    return <AdminDashboard />;
  }

  if (currentUserRoles.includes("dispatcher")) {
    return <DispatcherDashboard />;
  }

  return <DriverDashboard />;
};

export default Dashboard;
