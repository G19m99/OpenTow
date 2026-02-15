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
    isOnShift: v.optional(v.boolean()),
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

  // Tow calls (replaces jobs)
  calls: defineTable({
    tenantId: v.id("tenants"),
    callNumber: v.string(),
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
    priority: v.union(
      v.literal("normal"),
      v.literal("urgent"),
      v.literal("emergency")
    ),

    // Customer info
    customerId: v.optional(v.id("customers")),
    callerName: v.string(),
    callerPhone: v.string(),

    // Location info
    pickupAddress: v.string(),
    pickupNotes: v.optional(v.string()),
    dropoffAddress: v.optional(v.string()),
    dropoffNotes: v.optional(v.string()),

    // Vehicle info
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    vehicleYear: v.optional(v.string()),
    vehicleColor: v.optional(v.string()),
    vehicleLicensePlate: v.optional(v.string()),
    vehicleCondition: v.optional(v.string()),

    // Service info
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

    // Assignment info
    dispatcherId: v.id("users"),
    driverId: v.optional(v.id("users")),
    assignedAt: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),

    // Billing
    estimatedCost: v.optional(v.number()),
    actualCost: v.optional(v.number()),
    paymentStatus: v.optional(
      v.union(v.literal("pending"), v.literal("paid"), v.literal("invoiced"))
    ),
  })
    .index("by_tenantId", ["tenantId"])
    .index("by_status", ["tenantId", "status"])
    .index("by_driver", ["tenantId", "driverId"])
    .index("by_date", ["tenantId", "createdAt"])
    .index("by_callNumber", ["tenantId", "callNumber"]),

  // Customers table
  customers: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_tenantId", ["tenantId"])
    .index("by_phone", ["tenantId", "phone"]),

  // Call status history
  callStatusHistory: defineTable({
    callId: v.id("calls"),
    status: v.string(),
    updatedBy: v.id("users"),
    notes: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_call", ["callId"]),

  // Impounds table
  impounds: defineTable({
    tenantId: v.id("tenants"),

    // Vehicle info
    vehicleMake: v.string(),
    vehicleModel: v.string(),
    vehicleYear: v.optional(v.string()),
    vehicleColor: v.optional(v.string()),
    vehicleVin: v.optional(v.string()),
    vehicleLicensePlate: v.optional(v.string()),
    vehicleCondition: v.optional(v.string()),

    // Owner info
    ownerName: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    ownerAddress: v.optional(v.string()),

    // Impound details
    status: v.union(
      v.literal("active"),
      v.literal("pending_release"),
      v.literal("released"),
      v.literal("auctioned"),
      v.literal("junked")
    ),
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

    // Authority info
    authorityName: v.optional(v.string()),
    authorityContact: v.optional(v.string()),
    caseNumber: v.optional(v.string()),
    holdUntil: v.optional(v.number()),

    // Timestamps
    impoundedAt: v.number(),
    releasedAt: v.optional(v.number()),

    // Billing
    dailyRate: v.number(),
    towFee: v.optional(v.number()),
    adminFee: v.optional(v.number()),
    totalPaid: v.optional(v.number()),
    paymentStatus: v.union(
      v.literal("unpaid"),
      v.literal("partial"),
      v.literal("paid")
    ),

    // Users
    createdBy: v.id("users"),
    releasedBy: v.optional(v.id("users")),

    // Notes
    notes: v.optional(v.string()),
    releaseNotes: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenantId", ["tenantId"])
    .index("by_status", ["tenantId", "status"])
    .index("by_plate", ["tenantId", "vehicleLicensePlate"]),
};

export default defineSchema({
  ...applicationTables,
  ...authTables,
});
