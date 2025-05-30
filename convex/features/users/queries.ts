import { query } from "../../_generated/server";
import {
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
