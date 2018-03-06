import followUser from './followUser'
import updateUser from './updateUser'
import followingList from './followingList'
import placesAutoComplete from './placesAutoComplete'
import updateLocationAndTimezone from './updateLocationAndTimezone'

const resolvers = {
  Query: {
    getTitle: () => 'There PM!',
    userId: async (obj, args, ctx) => ctx.userId,
    user: (obj, args, ctx) => ctx.user.get(),
    followingList,
    placesAutoComplete,
  },

  Mutation: {
    updateUser,
    followUser,
    updateLocationAndTimezone,
  },

  User: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'User' : true,
  },
}

export default resolvers
