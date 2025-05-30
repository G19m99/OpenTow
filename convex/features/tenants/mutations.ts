import { ConvexError, v } from "convex/values";
import { mutation } from "../../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createTenant = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate input
    if (!args.name || !args.email || !args.timezone) {
      throw new Error("All fields are required");
    }

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("User is not authenticated");
    }

    // Create the tenant document
    const tenantId = await ctx.db.insert("tenants", {
      billingPlan: "free",
      createdAt: Date.now(),
      createdBy: userId,
      email: args.email,
      //TODO: in future only activate after email verification
      isActive: true,
      name: args.name,
      slug: "",
      timezone: args.timezone,
    });

    //by default assign the user as a admin in userTenants
    await ctx.db.insert("userTenants", {
      userId,
      tenantId: tenantId,
      roles: ["admin"],
      active: true,
    });

    // Return the created tenant
    return tenantId;
  },
});
