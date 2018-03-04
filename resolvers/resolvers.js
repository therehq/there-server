import followUser from './followUser'
import updateUser from './updateUser'
import followingList from './followingList'

const resolvers = {
  Query: {
    getTitle: () => 'There PM!',
    userId: async (obj, args, ctx) => ctx.userId,
    user: (obj, args, ctx) => ctx.user.get(),
    followingList,
  },

  Mutation: {
    updateUser,
    followUser,
  },

  User: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'User' : true,
  },
}

export default resolvers
