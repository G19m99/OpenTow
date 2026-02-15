import LoadingSpinner from "@/components/LoadingSpinner";
import NoTenantView from "@/components/tenants/NoTenantView";
import { TenantSelector } from "@/components/tenants/TenantSelector";
import type { RolesType } from "@/constants";
import { useTenantState } from "@/hooks/useTenantState";
import { Navigate, Outlet } from "react-router";
import Header from "./Navbar";
import MobileNavbar from "./MobileNavbar";

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

type AppLayoutProps = {
  roles: RolesType[];
};

const AppLayout = ({ roles }: AppLayoutProps) => (
  <div className="flex h-dvh flex-col bg-background">
    <Header roles={roles} />
    <main className="flex-1 overflow-y-auto pb-20 px-4 py-4">
      <Outlet />
    </main>
    <MobileNavbar userRoles={roles} />
  </div>
);
