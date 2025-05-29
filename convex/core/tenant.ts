import { query } from "../_generated/server";
import { userHasTenant } from "../lib/tenant";

export const userAssignedToTenant = query({
  args: {},
  handler: async (ctx) => {
    return await userHasTenant(ctx);
  },
});
