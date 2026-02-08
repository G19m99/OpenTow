import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import {
  getCurrentUserTenantId,
  requireAnyRoleOrThrow,
} from "../../lib/tenant";

export const createCustomer = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
    const tenantId = await getCurrentUserTenantId(ctx);

    return await ctx.db.insert("customers", {
      tenantId,
      name: args.name,
      phone: args.phone,
      email: args.email,
      address: args.address,
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});

export const updateCustomer = mutation({
  args: {
    customerId: v.id("customers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
    const tenantId = await getCurrentUserTenantId(ctx);

    const customer = await ctx.db.get(args.customerId);
    if (!customer || customer.tenantId !== tenantId) {
      throw new Error("Customer not found");
    }

    const { customerId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(customerId, filtered);
  },
});
