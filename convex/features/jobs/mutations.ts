import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { getCurrentUserTenant, requireAnyRoleOrThrow } from "../../lib/tenant";

export const createJob = mutation({
  args: {
    customerName: v.string(),
    phoneNumber: v.string(),
    location: v.string(),
    description: v.string(),
    vehicleInfo: v.string(),
    priority: v.union(v.literal("normal"), v.literal("high"), v.literal("low")),
    driverId: v.optional(v.id("users")),
    driverName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
    const tenant = await getCurrentUserTenant(ctx);

    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    //TODO: handle duplicate jobs
    const job = {
      tenantId: tenant.tenant.tenantId,
      customerName: args.customerName,
      customerPhone: args.phoneNumber,
      location: args.location,
      description: args.description,
      vehicleInfo: args.vehicleInfo,
      priority: args.priority,
      status: args.driverId ? ("assigned" as const) : ("open" as const),
      createdAt: Date.now(),
      dispatcherId: tenant.tenant.userId,
      driverId: args.driverId || undefined,
      driverName: args.driverName,
    };

    return await ctx.db.insert("jobs", job);
  },
});

export const updateJob = mutation({
  args: {
    id: v.id("jobs"),
    customerName: v.string(),
    phoneNumber: v.string(),
    location: v.string(),
    description: v.string(),
    vehicleInfo: v.string(),
    priority: v.union(v.literal("normal"), v.literal("high"), v.literal("low")),
    driverId: v.optional(v.id("users")),
    driverName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
    const tenant = await getCurrentUserTenant(ctx);

    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const job = await ctx.db.get(args.id);
    if (!job || job.tenantId !== tenant.tenant.tenantId) {
      throw new Error("Job not found");
    }

    const driverId = args.driverId || job.driverId;
    const shouldChangeStatusToAssigned = Boolean(
      driverId && job.status === "open"
    );

    const updatedJob = {
      ...job,
      customerName: args.customerName,
      customerPhone: args.phoneNumber,
      location: args.location,
      description: args.description,
      vehicleInfo: args.vehicleInfo,
      priority: args.priority,
      driverId: driverId,
      driverName: args.driverName || job.driverName,
      status: shouldChangeStatusToAssigned ? "assigned" : job.status,
    };

    return await ctx.db.patch(args.id, updatedJob);
  },
});

export const updateJobStatus = mutation({
  args: {
    id: v.id("jobs"),
    status: v.union(
      v.literal("open"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await requireAnyRoleOrThrow(ctx, ["dispatcher", "admin"]);
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
    const job = jobs.find((j) => j._id === args.id);
    if (!job) {
      throw new Error("Job not found");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      completedAt: args.status === "completed" ? Date.now() : undefined,
    });
  },
});
