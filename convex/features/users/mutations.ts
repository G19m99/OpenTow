import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import {
  getCurrentUserTenantId,
  requireRoleOrThrow,
  tenantAdminCount,
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
    const user = await userExistsInTenant(ctx, userId, tenantId);
    if (!user) throw new Error("User not found");

    if (role.name === "admin" && !role.active) {
      // We need to ensure that at least one admin exists in the tenant
      const admins = await tenantAdminCount(ctx, tenantId);
      if (admins <= 1) {
        throw new Error("Cannot remove the last admin from the tenant");
      }
    }
    const currentRoles = user.roles || [];
    const newRoles = currentRoles.includes(role.name)
      ? currentRoles.filter((r) => r !== role.name)
      : [...currentRoles, role.name];

    await ctx.db.patch(user._id, {
      roles: newRoles,
    });
  },
});

export const changeActiveStatus = mutation({
  args: {
    userId: v.id("users"),
    active: v.boolean(),
  },
  handler: async (ctx, { userId, active }) => {
    await requireRoleOrThrow(ctx, "admin");
    const tenantId = await getCurrentUserTenantId(ctx);
    const user = await userExistsInTenant(ctx, userId, tenantId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      active,
    });
  },
});
