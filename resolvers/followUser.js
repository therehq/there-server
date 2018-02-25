export default async (obj, args, ctx) => {
  const userToFollowId = args.userId

  const [user, userToFollow] = await ctx.models.User.findAll({
    where: { id: [ctx.userId, userToFollowId] },
  })

  // Follow
  await user.addFollowing(userToFollowId)

  const followedUser = userToFollow || user
  return followedUser.dataValues
}
