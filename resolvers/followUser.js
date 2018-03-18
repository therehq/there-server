import followingList from './followingList'

export default async (obj, args, ctx, info) => {
  // Follow
  await ctx.user.addFollowing(args.userId)
  const followedUser = await ctx.models.User.findById(args.userId)

  return followedUser
}
