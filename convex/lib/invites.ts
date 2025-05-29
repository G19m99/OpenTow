import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function acceptInvite(
  ctx: MutationCtx,
  userId: Id<"users">,
  email: string
) {
  const invites = await ctx.db
    .query("invites")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  console.log("Invites found:", invites);

  if (invites.length === 0) return;

  for (const invite of invites) {
    const tenant = await ctx.db.get(invite.tenantId);
    //TODO: handle expired invites
    if (!tenant || !tenant.isActive || invite.isAccepted) continue;

    await ctx.db.insert("userTenants", {
      userId: userId,
      tenantId: invite.tenantId,
      roles: invite.role,
    });

    await ctx.db.patch(invite._id, {
      isAccepted: true,
    });
  }
}
