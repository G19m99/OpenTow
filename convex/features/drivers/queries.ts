import { query } from "../../_generated/server";
import { getCurrentUserTenantId } from "../../lib/tenant";

export const getAllDriversWithShiftStatus = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", tenantId).eq("active", true)
      )
      .collect();

    const drivers = userTenants.filter((ut) => ut.roles.includes("driver"));

    const driversWithInfo = await Promise.all(
      drivers.map(async (ut) => {
        const user = await ctx.db.get(ut.userId);
        // Count active calls for this driver
        const activeCalls = await ctx.db
          .query("calls")
          .withIndex("by_driver", (q) =>
            q.eq("tenantId", tenantId).eq("driverId", ut.userId)
          )
          .collect();

        const activeCallCount = activeCalls.filter(
          (c) => c.status !== "completed" && c.status !== "cancelled"
        ).length;

        return {
          userId: ut.userId,
          name: user?.name ?? "Unknown",
          email: user?.email ?? "",
          isOnShift: ut.isOnShift ?? false,
          activeCallCount,
        };
      })
    );

    return driversWithInfo;
  },
});

export const getOnShiftDrivers = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", tenantId).eq("active", true)
      )
      .collect();

    const onShiftDrivers = userTenants.filter(
      (ut) => ut.roles.includes("driver") && ut.isOnShift
    );

    const driversWithInfo = await Promise.all(
      onShiftDrivers.map(async (ut) => {
        const user = await ctx.db.get(ut.userId);
        return {
          userId: ut.userId,
          name: user?.name ?? "Unknown",
          email: user?.email ?? "",
        };
      })
    );

    return driversWithInfo;
  },
});
