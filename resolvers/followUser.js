export default async (obj, args, ctx) => {
  const userToFollowId = args.userId

  const [user, userToFollow] = await ctx.models.User.findAll({
    where: { id: [ctx.userId, userToFollowId] },
  })

  // Follow
  await user.addFollowing(userToFollowId)

  // User either followed another user or himself/herself
  const followedUser = userToFollow || user
  return followedUser.get()
}
