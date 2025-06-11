import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../../_generated/server";

export const getActiveTenant = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const sessionId = await getAuthSessionId(ctx);
    if (!sessionId) {
      throw new Error("Session is not available");
    }

    const userSessions = await ctx.db
      .query("userSessionTenants")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!userSessions) {
      return {
        activeTenant: null,
        message: "No active tenant found for this session.",
      };
    }

    const ut = await ctx.db
      .query("userTenants")
      .withIndex("by_user_and_tenant", (q) =>
        q
          .eq("userId", userId)
          .eq("tenantId", userSessions.tenantId)
          .eq("active", true)
      )
      .first();

    if (!ut) throw new Error("Access denied");
    return { activeTenant: ut, message: "" };
  },
});
