import { mutation } from "../../_generated/server";
import { ConvexError, v } from "convex/values";
import {
  getCurrentUserTenantId,
  requireRoleOrThrow,
  userExistsInTenant,
} from "../../lib/tenant";

export const inviteUser = mutation({
  args: {
    email: v.string(),
    roles: v.array(
      v.union(v.literal("admin"), v.literal("dispatcher"), v.literal("driver"))
    ),
  },
  handler: async (ctx, args) => {
    await requireRoleOrThrow(ctx, "admin");
    const tenantId = await getCurrentUserTenantId(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (user) {
      const userTenant = await userExistsInTenant(ctx, user._id, tenantId);
      if (userTenant) {
        throw new ConvexError("User already exists in the tenant");
      }
    }

    const existingInvite = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) =>
        q
          .eq("email", args.email)
          .eq("isAccepted", false)
          .lt("expiresAt", Date.now())
      )
      .first();

    if (existingInvite) return existingInvite._id;

    const invite = {
      email: args.email,
      tenantId,
      role: args.roles,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      isAccepted: false,
    };

    return await ctx.db.insert("invites", invite);
    //TODO: send invite
  },
});
