import { api } from "@c/_generated/api";
import { useQuery } from "convex/react";

export const useTenantState = () => {
  const tenantList = useQuery(api.features.users.queries.getUserTenants);
  const activeTenant = useQuery(
    api.features.tenants.queries.getActiveTenant,
    tenantList !== undefined && tenantList.length > 1 ? undefined : "skip"
  );

  const isLoadingTenants = tenantList === undefined;
  const isLoadingActiveTenant =
    tenantList && tenantList.length > 1 && activeTenant === undefined;

  return {
    tenantList: tenantList || [],
    activeTenant,
    isLoadingTenants,
    isLoadingActiveTenant,
    isLoading: isLoadingTenants || isLoadingActiveTenant,
  };
};
