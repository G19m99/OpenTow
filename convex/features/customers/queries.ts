import { v } from "convex/values";
import { query } from "../../_generated/server";
import { getCurrentUserTenantId } from "../../lib/tenant";

export const searchByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    if (!args.phone || args.phone.length < 3) return [];

    const customers = await ctx.db
      .query("customers")
      .withIndex("by_phone", (q) => q.eq("tenantId", tenantId))
      .collect();

    return customers.filter((c) => c.phone.includes(args.phone));
  },
});

export const getById = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenantId(ctx);
    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.tenantId !== tenantId) return null;
    return customer;
  },
});
