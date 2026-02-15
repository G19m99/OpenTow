import { v } from "convex/values";
import { query } from "../../_generated/server";
import {
  getCurrentUserTenant,
  getCurrentUserTenantId,
} from "../../lib/tenant";

export const allCalls = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    const calls = await ctx.db
      .query("calls")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .collect();

    return calls;
  },
});

export const getCallById = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenantId(ctx);
    const call = await ctx.db.get(args.callId);
    if (!call || call.tenantId !== tenantId) return null;
    return call;
  },
});

export const getCallHistory = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, args) => {
    const tenantId = await getCurrentUserTenantId(ctx);
    const call = await ctx.db.get(args.callId);
    if (!call || call.tenantId !== tenantId) return [];

    const history = await ctx.db
      .query("callStatusHistory")
      .withIndex("by_call", (q) => q.eq("callId", args.callId))
      .collect();

    return history;
  },
});

export const openCalls = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    const calls = await ctx.db
      .query("calls")
      .withIndex("by_status", (q) =>
        q.eq("tenantId", tenantId).eq("status", "open")
      )
      .collect();

    return calls;
  },
});

export const usersCalls = query({
  args: {},
  handler: async (ctx) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const calls = await ctx.db
      .query("calls")
      .withIndex("by_driver", (q) =>
        q
          .eq("tenantId", tenant.tenant.tenantId)
          .eq("driverId", tenant.tenant.userId)
      )
      .collect();

    return calls;
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await getCurrentUserTenantId(ctx);

    const allCalls = await ctx.db
      .query("calls")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
      .collect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const openCalls = allCalls.filter((c) => c.status === "open");
    const activeCalls = allCalls.filter(
      (c) =>
        c.status !== "open" &&
        c.status !== "completed" &&
        c.status !== "cancelled"
    );
    const completedToday = allCalls.filter(
      (c) => c.status === "completed" && (c.completedAt ?? 0) >= todayStart
    );

    // Count drivers on shift
    const userTenants = await ctx.db
      .query("userTenants")
      .withIndex("by_tenantId", (q) =>
        q.eq("tenantId", tenantId).eq("active", true)
      )
      .collect();

    const driversOnShift = userTenants.filter(
      (ut) => ut.roles.includes("driver") && ut.isOnShift
    );

    return {
      openCalls: openCalls.length,
      activeCalls: activeCalls.length,
      completedToday: completedToday.length,
      driversOnShift: driversOnShift.length,
      totalCalls: allCalls.length,
    };
  },
});
