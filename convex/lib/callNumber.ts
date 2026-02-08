import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

/**
 * Generate the next sequential call number for a tenant.
 * Format: OT-0001, OT-0002, etc.
 */
export async function generateCallNumber(
  ctx: MutationCtx,
  tenantId: Id<"tenants">
): Promise<string> {
  const calls = await ctx.db
    .query("calls")
    .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
    .collect();

  const nextNumber = calls.length + 1;
  return `OT-${String(nextNumber).padStart(4, "0")}`;
}
