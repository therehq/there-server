import followUser from './followUser'
import updateUser from './updateUser'
import followingList from './followingList'

const resolvers = {
  Query: {
    getTitle: () => 'There PM!',
    userId: async (obj, args, ctx) => ctx.userId,
    user: async (obj, args, ctx) => {
      const user = await ctx.models.User.findById(ctx.userId)
      return user.dataValues
    },
    followingList,
  },
  Mutation: {
    updateUser,
    followUser,
  },
}

export default resolvers
