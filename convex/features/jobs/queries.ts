import { query } from "../../_generated/server";
import { getCurrentUserTenantId } from "../../lib/tenant";

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
