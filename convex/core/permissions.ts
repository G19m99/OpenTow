import { query } from "../_generated/server";
import { getCurrentUserTenant } from "../lib/tenant";

export const getUserRoles = query({
  args: {},
  handler: async (ctx) => {
    //call the getCurrentUserTenant function to get the user's tenant and role
    const userTenant = await getCurrentUserTenant(ctx);
    if (!userTenant) {
      return "";
    }

    return userTenant.role;
  },
});
