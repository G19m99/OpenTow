import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getCurrentUserTenantId, requireAnyRoleOrThrow } from "../../lib/tenant";

export const allImpounds = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRoleOrThrow(ctx, ["admin", "dispatcher"]);
    const tenantId = await getCurrentUserTenantId(ctx);

    return await ctx.db
      .query("impounds")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

export const getById = query({
  args: { impoundId: v.id("impounds") },
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenantId(ctx);
    const impound = await ctx.db.get(args.impoundId);
    if (!impound || impound.tenantId !== tenantId) return null;
    return impound;
  },
});

export const impoundStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRoleOrThrow(ctx, ["admin", "dispatcher"]);
    const tenantId = await getCurrentUserTenantId(ctx);

    const impounds = await ctx.db
      .query("impounds")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .collect();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const inLot = impounds.filter((i) => i.status === "active").length;
    const pendingRelease = impounds.filter(
      (i) => i.status === "pending_release"
    ).length;
    const releasedThisMonth = impounds.filter(
      (i) => i.status === "released" && (i.releasedAt ?? 0) >= monthStart
    ).length;

    const outstanding = impounds
      .filter((i) => i.paymentStatus !== "paid" && i.status === "active")
      .reduce((sum, i) => {
        const days = Math.ceil(
          (Date.now() - i.impoundedAt) / (1000 * 60 * 60 * 24)
        );
        const storageCharge = days * i.dailyRate;
        const total = storageCharge + (i.towFee ?? 0) + (i.adminFee ?? 0);
        return sum + total - (i.totalPaid ?? 0);
      }, 0);

    return { inLot, pendingRelease, releasedThisMonth, outstanding };
  },
});
