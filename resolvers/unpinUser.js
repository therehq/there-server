export default async (obj, args, ctx, info) => {
  // Unpin
  await ctx.user.removePinnedUsers(args.userId)
  return true
}
