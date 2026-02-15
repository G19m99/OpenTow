import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import {
  getCurrentUserTenant,
  requireAnyRoleOrThrow,
} from "../../lib/tenant";

export const createImpound = mutation({
  args: {
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    vehicleYear: v.optional(v.string()),
    vehicleColor: v.optional(v.string()),
    vehicleVin: v.optional(v.string()),
    vehicleLicensePlate: v.optional(v.string()),
    vehicleCondition: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    ownerAddress: v.optional(v.string()),
    reason: v.union(
      v.literal("police_hold"),
      v.literal("abandoned"),
      v.literal("private_property"),
      v.literal("accident"),
      v.literal("repo"),
      v.literal("storage"),
      v.literal("other")
    ),
    reasonNotes: v.optional(v.string()),
    lotLocation: v.optional(v.string()),
    callId: v.optional(v.id("calls")),
    authorityName: v.optional(v.string()),
    authorityContact: v.optional(v.string()),
    caseNumber: v.optional(v.string()),
    holdUntil: v.optional(v.number()),
    dailyRate: v.number(),
    towFee: v.optional(v.number()),
    adminFee: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["admin", "dispatcher"]);
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) throw new Error("No tenant");

    const now = Date.now();
    return await ctx.db.insert("impounds", {
      tenantId: tenant.tenant.tenantId,
      ...args,
      status: "active",
      paymentStatus: "unpaid",
      impoundedAt: now,
      createdBy: tenant.tenant.userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    impoundId: v.id("impounds"),
    status: v.union(
      v.literal("active"),
      v.literal("pending_release"),
      v.literal("released"),
      v.literal("auctioned"),
      v.literal("junked")
    ),
    releaseNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["admin", "dispatcher"]);
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) throw new Error("No tenant");

    const impound = await ctx.db.get(args.impoundId);
    if (!impound || impound.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Impound not found");
    }

    const now = Date.now();
    const isReleasing = ["released", "auctioned", "junked"].includes(
      args.status
    );

    await ctx.db.patch(args.impoundId, {
      status: args.status,
      updatedAt: now,
      releaseNotes: args.releaseNotes,
      releasedAt: isReleasing ? now : undefined,
      releasedBy: isReleasing ? tenant.tenant.userId : undefined,
    });
  },
});

export const recordPayment = mutation({
  args: {
    impoundId: v.id("impounds"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["admin", "dispatcher"]);
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) throw new Error("No tenant");

    const impound = await ctx.db.get(args.impoundId);
    if (!impound || impound.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Impound not found");
    }

    const newTotal = (impound.totalPaid ?? 0) + args.amount;

    // Calculate total owed
    const days = Math.ceil(
      (Date.now() - impound.impoundedAt) / (1000 * 60 * 60 * 24)
    );
    const totalOwed =
      days * impound.dailyRate +
      (impound.towFee ?? 0) +
      (impound.adminFee ?? 0);

    await ctx.db.patch(args.impoundId, {
      totalPaid: newTotal,
      paymentStatus: newTotal >= totalOwed ? "paid" : "partial",
      updatedAt: Date.now(),
    });
  },
});
