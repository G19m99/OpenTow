import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import {
  getCurrentUserTenant,
  requireAnyRoleOrThrow,
} from "../../lib/tenant";
import { generateCallNumber } from "../../lib/callNumber";

export const createCall = mutation({
  args: {
    priority: v.union(
      v.literal("normal"),
      v.literal("urgent"),
      v.literal("emergency")
    ),
    callerName: v.string(),
    callerPhone: v.string(),
    pickupAddress: v.string(),
    pickupNotes: v.optional(v.string()),
    dropoffAddress: v.optional(v.string()),
    dropoffNotes: v.optional(v.string()),
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    vehicleYear: v.optional(v.string()),
    vehicleColor: v.optional(v.string()),
    vehicleLicensePlate: v.optional(v.string()),
    vehicleCondition: v.optional(v.string()),
    serviceType: v.union(
      v.literal("breakdown"),
      v.literal("accident"),
      v.literal("lockout"),
      v.literal("fuel_delivery"),
      v.literal("tire_change"),
      v.literal("jump_start"),
      v.literal("winch_out"),
      v.literal("transport"),
      v.literal("other")
    ),
    serviceNotes: v.optional(v.string()),
    customerId: v.optional(v.id("customers")),
    driverId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
    const tenant = await getCurrentUserTenant(ctx);

    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const tenantId = tenant.tenant.tenantId;
    const now = Date.now();
    const callNumber = await generateCallNumber(ctx, tenantId);

    const callId = await ctx.db.insert("calls", {
      tenantId,
      callNumber,
      status: args.driverId ? "assigned" : "open",
      priority: args.priority,
      callerName: args.callerName,
      callerPhone: args.callerPhone,
      pickupAddress: args.pickupAddress,
      pickupNotes: args.pickupNotes,
      dropoffAddress: args.dropoffAddress,
      dropoffNotes: args.dropoffNotes,
      vehicleMake: args.vehicleMake,
      vehicleModel: args.vehicleModel,
      vehicleYear: args.vehicleYear,
      vehicleColor: args.vehicleColor,
      vehicleLicensePlate: args.vehicleLicensePlate,
      vehicleCondition: args.vehicleCondition,
      serviceType: args.serviceType,
      serviceNotes: args.serviceNotes,
      customerId: args.customerId,
      dispatcherId: tenant.tenant.userId,
      driverId: args.driverId,
      assignedAt: args.driverId ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });

    // Log initial status
    await ctx.db.insert("callStatusHistory", {
      callId,
      status: args.driverId ? "assigned" : "open",
      updatedBy: tenant.tenant.userId,
      notes: "Call created",
      timestamp: now,
    });

    return callId;
  },
});

export const updateCallStatus = mutation({
  args: {
    callId: v.id("calls"),
    status: v.union(
      v.literal("open"),
      v.literal("assigned"),
      v.literal("en_route"),
      v.literal("on_scene"),
      v.literal("hooked"),
      v.literal("in_transit"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const call = await ctx.db.get(args.callId);
    if (!call || call.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Call not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.callId, {
      status: args.status,
      updatedAt: now,
      completedAt: args.status === "completed" ? now : undefined,
    });

    // Log status change
    await ctx.db.insert("callStatusHistory", {
      callId: args.callId,
      status: args.status,
      updatedBy: tenant.tenant.userId,
      notes: args.notes,
      timestamp: now,
    });
  },
});

export const claimCall = mutation({
  args: {
    callId: v.id("calls"),
  },
  handler: async (ctx, args) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const call = await ctx.db.get(args.callId);
    if (!call || call.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Call not found or not accessible");
    }

    if (call.status !== "open") {
      throw new Error("Call is not open for claiming");
    }

    const now = Date.now();
    await ctx.db.patch(args.callId, {
      status: "assigned",
      driverId: tenant.tenant.userId,
      assignedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("callStatusHistory", {
      callId: args.callId,
      status: "assigned",
      updatedBy: tenant.tenant.userId,
      notes: "Driver claimed call",
      timestamp: now,
    });
  },
});

export const assignCall = mutation({
  args: {
    callId: v.id("calls"),
    driverId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const call = await ctx.db.get(args.callId);
    if (!call || call.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Call not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.callId, {
      status: "assigned",
      driverId: args.driverId,
      assignedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("callStatusHistory", {
      callId: args.callId,
      status: "assigned",
      updatedBy: tenant.tenant.userId,
      notes: "Call assigned by dispatcher",
      timestamp: now,
    });
  },
});

export const cancelCall = mutation({
  args: {
    callId: v.id("calls"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const call = await ctx.db.get(args.callId);
    if (!call || call.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Call not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.callId, {
      status: "cancelled",
      updatedAt: now,
    });

    await ctx.db.insert("callStatusHistory", {
      callId: args.callId,
      status: "cancelled",
      updatedBy: tenant.tenant.userId,
      notes: args.reason || "Call cancelled",
      timestamp: now,
    });
  },
});
