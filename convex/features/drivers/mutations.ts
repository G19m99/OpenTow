import { mutation } from "../../_generated/server";
import { getCurrentUserTenant } from "../../lib/tenant";

export const toggleShift = mutation({
  args: {},
  handler: async (ctx) => {
    const tenant = await getCurrentUserTenant(ctx);
    if (!tenant) {
      throw new Error("User has no tenant assigned");
    }

    const currentShift = tenant.tenant.isOnShift ?? false;
    await ctx.db.patch(tenant.tenant._id, {
      isOnShift: !currentShift,
    });

    return !currentShift;
  },
});
