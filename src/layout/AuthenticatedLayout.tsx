import LoadingSpinner from "@/components/LoadingSpinner";
import NoTenantView from "@/components/tenants/NoTenantView";
import { TenantSelector } from "@/components/tenants/TenantSelector";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { RolesType } from "@/constants";
import { useTenantState } from "@/hooks/useTenantState";
import { Navigate, Outlet } from "react-router";
import AppSidebar from "./AppSidebar";
import MobileNavbar from "./MobileNavbar";
import Navbar from "./Navbar";

export function AuthenticatedLayout() {
  const { tenantList, activeTenant, isLoadingTenants, isLoadingActiveTenant } =
    useTenantState();

  // Loading states
  if (isLoadingTenants) {
    return <LoadingSpinner message="Loading your organizations..." />;
  }

  if (isLoadingActiveTenant) {
    return <LoadingSpinner message="Loading active organization..." />;
  }

  // No tenants scenario
  if (tenantList.length === 0) {
    return <NoTenantView />;
  }

  // Single tenant scenario
  if (tenantList.length === 1) {
    const tenant = tenantList[0];
    return (
      <TenantSelector tenantId={tenant._id} roles={tenant.roles}>
        <AppLayout roles={tenant.roles} />
      </TenantSelector>
    );
  }

  // Multiple tenants scenario
  if (!activeTenant?.activeTenant) {
    return <Navigate to="/org-picker" replace />;
  }

  const { tenantId, roles } = activeTenant.activeTenant;

  return (
    <TenantSelector tenantId={tenantId} roles={roles}>
      <AppLayout roles={roles} />
    </TenantSelector>
  );
}

export default AuthenticatedLayout;

type SingleTenantViewProps = {
  roles: RolesType[];
};

const AppLayout = ({ roles }: SingleTenantViewProps) => (
  <SidebarProvider>
    <div className="h-screen w-screen overflow-hidden">
      <Navbar />
      <AppSidebar userRoles={roles} />
      <div className="h-full max-h-[calc(100%-129px)] overflow-y-auto">
        <Outlet />
      </div>
      <MobileNavbar userRoles={roles} />
    </div>
  </SidebarProvider>
);
