export default async (obj, args, ctx) => {
  // Follow
  await ctx.user.addFollowing(args.userId)
  const followedUser = await ctx.models.User.findById(args.userId)

  console.log(`--- FOLLOWED ${args.userId} ---`)

  return followedUser.get()
}
