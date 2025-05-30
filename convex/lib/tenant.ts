import { QueryCtx, MutationCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the current user's tenant information
 * Throws an error if user is not authenticated or has no tenant
 */
export async function getCurrentUserTenant(ctx: QueryCtx | MutationCtx) {
  // Get the current user ID from convex-auth
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null; // User is not authenticated
  }

  // Get the user's tenant relationship
  const userTenant = await ctx.db
    .query("userTenants")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first(); //! Assuming user belongs to one tenant for now

  if (!userTenant) {
    return null;
  }

  return {
    tenant: userTenant,
    roles: userTenant.roles,
  };
}

/**
 * Get just the tenant ID for the current user
 * Useful when you only need the tenant ID for filtering
 */
export async function getCurrentUserTenantId(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"tenants">> {
  const tenant = await getCurrentUserTenant(ctx);
  if (!tenant) {
    throw new ConvexError("User has no tenant assigned");
  }
  return tenant.tenant.tenantId;
}

/**
 * Get a user by from a tenant
 */
export async function getUserFromTenant(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  tenantId: Id<"tenants">
) {
  const userTenant = await ctx.db
    .query("userTenants")
    .withIndex("by_user_and_tenant", (q) =>
      q.eq("userId", userId).eq("tenantId", tenantId)
    )
    .first();

  if (!userTenant) {
    throw new ConvexError("User not found in this tenant");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new ConvexError("User record not found");
  }

  return {
    ...user,
    roles: userTenant.roles,
    tenantId: userTenant.tenantId,
  };
}

/**
 * User exists in tenant
 */
export async function userExistsInTenant(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  tenantId: Id<"tenants">
) {
  const userTenant = await ctx.db
    .query("userTenants")
    .withIndex("by_user_and_tenant", (q) =>
      q.eq("userId", userId).eq("tenantId", tenantId)
    )
    .first();

  return userTenant;
}

/**
 * Check if the current user has a specific role within their tenant
 */
export async function hasRole(
  ctx: QueryCtx | MutationCtx,
  requiredRole: "admin" | "dispatcher" | "driver"
) {
  const tenant = await getCurrentUserTenant(ctx);
  if (!tenant) {
    return false;
  }
  return tenant.roles.includes(requiredRole);
}
/**
 * Check role and throw error if not
 */
export async function requireRoleOrThrow(
  ctx: QueryCtx | MutationCtx,
  requiredRole: "admin" | "dispatcher" | "driver"
) {
  const tenant = await getCurrentUserTenant(ctx);
  if (!tenant) {
    throw new ConvexError("User has no tenant assigned");
  }
  if (!tenant.roles.includes(requiredRole)) {
    throw new ConvexError(`Access denied. Required role: ${requiredRole}`);
  }
}

/**
 * Check array of roles and throw error if not
 */
export async function requireAnyRoleOrThrow(
  ctx: QueryCtx | MutationCtx,
  requiredRoles: ("admin" | "dispatcher" | "driver")[]
) {
  const tenant = await getCurrentUserTenant(ctx);
  if (!tenant) {
    throw new ConvexError("User has no tenant assigned");
  }
  const hasAnyRole = requiredRoles.some((role) => tenant.roles.includes(role));
  if (!hasAnyRole) {
    throw new ConvexError(
      `Access denied. Required roles: ${requiredRoles.join(", ")}`
    );
  }
}
/**
 * Ensure user has required role, throw error if not
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  requiredRole: "admin" | "dispatcher" | "driver"
) {
  const hasRequiredRole = await hasRole(ctx, requiredRole);
  if (!hasRequiredRole) {
    throw new ConvexError(`Access denied. Required role: ${requiredRole}`);
  }
}

/**
 * Get all tenants for a user (future prrofing where a user can belong to multiple tenants)
 */
export async function getUserTenants(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return [];
  }

  const userTenants = await ctx.db
    .query("userTenants")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

  const tenantsWithRoles = userTenants.map((userTenant) => {
    return {
      tenantId: userTenant.tenantId,
      roles: userTenant.roles,
    };
  });

  //! Needed?
  return tenantsWithRoles.filter((item) => item.tenantId !== null);
}

/**
 * Check if current user has any tenant assignments
 */
export async function userHasTenant(
  ctx: QueryCtx | MutationCtx
): Promise<boolean> {
  const tenant = await getCurrentUserTenant(ctx);
  return tenant !== null;
}

export async function tenantAdminCount(
  ctx: QueryCtx | MutationCtx,
  tenantId: Id<"tenants">
) {
  // Ensure at least one admin exists in the tenant
  const userTenants = await ctx.db
    .query("userTenants")
    .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
    .collect();

  const admins = userTenants.filter((userTenant) =>
    userTenant.roles.includes("admin")
  );

  return admins.length;
}
