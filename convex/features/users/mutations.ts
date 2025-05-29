import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import {
  getCurrentUserTenantId,
  requireRoleOrThrow,
  userExistsInTenant,
} from "../../lib/tenant";

export const changeUserRoleAccess = mutation({
  args: {
    userId: v.id("users"),
    role: v.object({
      name: v.union(
        v.literal("admin"),
        v.literal("dispatcher"),
        v.literal("driver")
      ),
      active: v.boolean(),
    }),
  },
  handler: async (ctx, { userId, role }) => {
    await requireRoleOrThrow(ctx, "admin");
    const tenantId = await getCurrentUserTenantId(ctx);
    const userExists = await userExistsInTenant(ctx, userId, tenantId);
    if (!userExists) throw new Error("User not found");

    const currentRoles = userExists.roles || [];
    const newRoles = currentRoles.includes(role.name)
      ? currentRoles.filter((r) => r !== role.name)
      : [...currentRoles, role.name];

    await ctx.db.patch(userExists._id, {
      roles: newRoles,
    });
  },
});
