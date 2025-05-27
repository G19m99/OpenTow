import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  userRoles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("dispatcher"),
      v.literal("driver")
    ),
  }).index("by_user", ["userId"]),
  jobs: defineTable({
    location: v.string(),
    description: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("assigned"),
      v.literal("completed")
    ),
    priority: v.union(v.literal("normal"), v.literal("high"), v.literal("low")),
    vehicleInfo: v.string(),
    createdAt: v.number(),
    dispatcherId: v.id("users"),
    driverId: v.optional(v.id("users")),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_driver", ["driverId"])
    .index("by_date", ["createdAt"]),
};

export default defineSchema({
  ...applicationTables,
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    roles: v.optional(
      v.union(v.literal("admin"), v.literal("dispatcher"), v.literal("driver"))
    ),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  // Add other tables here as needed
});
