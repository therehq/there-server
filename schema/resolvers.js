const resolvers = {
  Query: {
    getTitle: () => 'There PM!',
    user: async (obj, args, ctx) => {
      const user = await ctx.models.User.findById(ctx.userId)
      return user.dataValues
    },
    userId: async (obj, args, ctx) => ctx.userId,
  },
  Mutation: {
    followUser: async (obj, args, ctx) => {
      const userToFollowId = args.userId

      const [user, userToFollow] = await ctx.models.User.findAll({
        where: { id: [ctx.userId, userToFollowId] },
      })

      // Follow
      await user.addFollowing(userToFollowId)

      const followedUser = userToFollow || user
      return followedUser.dataValues
    },
  },
}

export default resolvers
