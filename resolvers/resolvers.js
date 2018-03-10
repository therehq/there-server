import followUser from './followUser'
import updateUser from './updateUser'
import followingList from './followingList'
import placesAutoComplete from './placesAutoComplete'
import updateLocationAndTimezone from './updateLocationAndTimezone'
import allUsersByName from './allUsersByName'

const resolvers = {
  Query: {
    title: () => 'There PM!',
    userId: async (obj, args, ctx) => ctx.userId,
    user: (obj, args, ctx) => ctx.user.get(),
    followingList,
    placesAutoComplete,
    allUsersByName,
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
