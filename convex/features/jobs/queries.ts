import { query } from "../../_generated/server";
import { getCurrentUserTenant, getCurrentUserTenantId } from "../../lib/tenant";

export const allJobs = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .collect();

    return jobs;
  },
});

export const usersJobs = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_driver", (q) =>
        q
          .eq("tenantId", tenant.tenant.tenantId)
          .eq("driverId", tenant.tenant.userId)
      )
      .collect();

    return jobs;
  },
});

export const openJobs = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) =>
        q.eq("tenantId", tenant.tenant.tenantId).eq("status", "open")
      )
      .collect();

    return jobs;
  },
});
