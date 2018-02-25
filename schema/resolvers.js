import { User } from '../models'

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
    updateUser: async (obj, args, ctx) => {
      const [affected] = await ctx.models.User.update(args, {
        where: { id: ctx.userId },
      })
      // Return user
      if (affected === 1) {
        const user = await ctx.models.User.findById(ctx.userId)
        return user.dataValues
      }
      // Nothing affected
      return {}
    },
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
