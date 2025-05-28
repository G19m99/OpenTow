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
    throw new ConvexError("User not authenticated");
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
    role: userTenant.role,
  };
}

/**
 * Get just the tenant ID for the current user
 * Useful when you only need the tenant ID for filtering
 */
export async function getCurrentUserTenantId(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"userTenants">> {
  const tenant = await getCurrentUserTenant(ctx);
  if (!tenant) {
    throw new ConvexError("User has no tenant assigned");
  }
  return tenant.tenant._id;
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
  // Define role hierarchy (admin > dispatcher > driver)
  const roleHierarchy = {
    admin: 3,
    dispatcher: 2,
    driver: 1,
  };

  return roleHierarchy[tenant.role] >= roleHierarchy[requiredRole];
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
    throw new ConvexError("User not authenticated");
  }

  const userTenants = await ctx.db
    .query("userTenants")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

  const tenantsWithRoles = userTenants.map((userTenant) => {
    return {
      tenantId: userTenant.tenantId,
      role: userTenant.role,
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
