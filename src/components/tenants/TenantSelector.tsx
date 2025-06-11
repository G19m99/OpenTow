import type { RolesType } from "@/constants";
import { api } from "@c/_generated/api";
import type { Id } from "@c/_generated/dataModel";
import { useMutation } from "convex/react";
import React from "react";
import ErrorState from "../ErrorState";

type TenantSelectorProps = {
  tenantId: Id<"tenants">;
  roles: RolesType[];
  children: React.ReactNode;
};

export const TenantSelector = ({
  tenantId,
  roles,
  children,
}: TenantSelectorProps) => {
  const selectTenant = useMutation(api.features.tenants.mutations.selectTenant);

  selectTenant({ tenantId });

  if (!roles || roles.length === 0) {
    return (
      <ErrorState
        title="Access Denied"
        message="No role assigned. Please contact your site administrator for access."
      />
    );
  }

  return <>{children}</>;
};
