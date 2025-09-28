import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../../_generated/server";
import {
  getCurrentUserTenant,
  getCurrentUserTenantId,
  hasRole,
  requireAnyRoleOrThrow,
} from "../../lib/tenant";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const hasPermission = await hasRole(ctx, "admin");
    if (!hasPermission) {
      throw new Error("You do not have permission to view users");
    }
    const tenantId = await getCurrentUserTenantId(ctx);
    if (!tenantId) {
      return [];
    }

    // Fetch all users in the current tenant
    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .collect();

    // Then fetch the actual user records for each userId
    const users = await Promise.all(
      userTenants.map(async (userTenant) => {
        const user = await ctx.db.get(userTenant.userId);
        if (!user) return null;
        return {
          ...user,
          roles: userTenant.roles, // Include the roles from the junction table
          tenantId: userTenant.tenantId,
          active: userTenant.active,
        };
      })
    );

    const filteredUsers = users.filter(
      (user): user is NonNullable<typeof user> =>
        user !== null && user._id !== undefined
    );

    return filteredUsers;
  },
});

export const getDrivers = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRoleOrThrow(ctx, ["admin", "dispatcher"]);
    const tenantId = await getCurrentUserTenantId(ctx);

    const driverIds = await ctx.db
      .query("userTenants")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", tenantId).eq("active", true)
      )
      .collect()
      .then((rows) => rows.filter((row) => row.roles.includes("driver")));

    const users = await Promise.all(
      driverIds.map(async (driver) => {
        const user = await ctx.db.get(driver.userId);
        if (!user) return null;
        return {
          ...user,
          roles: driver.roles,
          tenantId: driver.tenantId,
        };
      })
    );

    const filteredUsers = users.filter(
      (user): user is NonNullable<typeof user> =>
        user !== null && user._id !== undefined
    );

    return filteredUsers;
  },
});

export const getUserTenants = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUserId(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Fetch all userTenants for the current user
    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_userId", (q) => q.eq("userId", user).eq("active", true))
      .collect();

    // Fetch the tenant details for each userTenant
    const tenants = await Promise.all(
      userTenants.map(async (userTenant) => {
        const tenant = await ctx.db.get(userTenant.tenantId);
        if (!tenant) return null;
        return {
          ...tenant,
          roles: userTenant.roles, // Include the roles from the junction table
          active: userTenant.active,
        };
      })
    );

    return tenants.filter(
      (tenant): tenant is NonNullable<typeof tenant> =>
        tenant !== null && tenant._id !== undefined
    );
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userInfo = await getCurrentUserTenant(ctx);
    if (!userInfo) {
      throw new Error("User has no tenant assigned");
    }

    return userInfo.tenant;
  },
});

export const getCurrentUserRoles = query({
  args: {},
  handler: async (ctx) => {
    const userInfo = await getCurrentUserTenant(ctx);
    if (!userInfo) {
      throw new Error("User has no tenant assigned");
    }

    return userInfo.roles;
  },
});
