import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import { acceptInvite } from "./lib/invites";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId, profile }) {
      console.log("User created or updated:", userId);

      if (profile?.email) {
        await acceptInvite(ctx, userId, profile.email);
      }
    },
  },
});
