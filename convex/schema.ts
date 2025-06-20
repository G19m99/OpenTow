import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  tenants: defineTable({
    name: v.string(),
    slug: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    timezone: v.string(),
    billingPlan: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    createdAt: v.number(),
    createdBy: v.id("users"),
    isActive: v.boolean(),
    logoUrl: v.optional(v.string()),
  }),
  userTenants: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    roles: v.array(
      v.union(v.literal("admin"), v.literal("dispatcher"), v.literal("driver"))
    ),
    active: v.boolean(),
  })
    .index("by_userId", ["userId", "active"])
    .index("by_tenantId", ["tenantId", "active"])
    .index("by_user_and_tenant", ["userId", "tenantId", "active"]),
  userSessionTenants: defineTable({
    sessionId: v.id("authSessions"),
    tenantId: v.id("tenants"),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),
  invites: defineTable({
    email: v.string(),
    tenantId: v.id("tenants"),
    role: v.array(
      v.union(v.literal("admin"), v.literal("dispatcher"), v.literal("driver"))
    ),
    createdAt: v.number(),
    expiresAt: v.number(),
    isAccepted: v.boolean(),
  })
    .index("by_email", ["email", "isAccepted", "expiresAt"])
    .index("by_tenantId", ["tenantId", "isAccepted", "expiresAt"]),
  jobs: defineTable({
    tenantId: v.id("tenants"),
    location: v.string(),
    description: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    priority: v.union(v.literal("normal"), v.literal("high"), v.literal("low")),
    vehicleInfo: v.string(),
    createdAt: v.number(),
    dispatcherId: v.id("users"),
    driverId: v.optional(v.id("users")),
    driverName: v.optional(v.string()),
    completedAt: v.optional(v.number()),
  })
    .index("by_tenantId", ["tenantId"])
    .index("by_status", ["tenantId", "status"])
    .index("by_driver", ["tenantId", "driverId"])
    .index("by_date", ["tenantId", "createdAt"]),
};

export default defineSchema({
  ...applicationTables,
  ...authTables,
});
