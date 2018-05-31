// Queries
import followingList from './followingList'
import placesAutoComplete from './placesAutoComplete'
import allUsersByName from './allUsersByName'
import manualPerson from './manualPerson'
import manualPlace from './manualPlace'

// Mutations
import followUser from './followUser'
import updateUser from './updateUser'
import updateLocationAndTimezone from './updateLocationAndTimezone'
import updateLocationAndTimezoneForUser from './updateLocationAndTimezoneForUser'
import addManualPlace from './addManualPlace'
import addManualPerson from './addManualPerson'
import unfollow from './unfollow'
import deleteAccount from './deleteAccount'
import removeManualPerson from './removeManualPerson'
import removeManualPlace from './removeManualPlace'
import sortFollowings from './sortFollowings'
import updateManualPerson from './updateManualPerson'
import updateManualPlace from './updateManualPlace'

// Method
import countryFlagIcon from './countryFlagIcon'

const resolvers = {
  Query: {
    title: () => 'There PM!',
    userId: async (obj, args, ctx) => ctx.userId,
    user: (obj, args, ctx) => ctx.user.get(),
    followingList,
    placesAutoComplete,
    allUsersByName,
    manualPerson,
    manualPlace,
  },

  Mutation: {
    refresh: () => ({ id: 1 }),
    updateUser,
    followUser,
    updateLocationAndTimezone,
    updateLocationAndTimezoneForUser,
    addManualPlace,
    addManualPerson,
    unfollow,
    deleteAccount,
    removeManualPerson,
    removeManualPlace,
    followingList,
    sortFollowings,
    updateManualPerson,
    updateManualPlace,
  },

  // TYPES
  User: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'User' : true,
    countryFlagIcon,
  },
  ManualPerson: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'ManualPerson' : true,
    countryFlagIcon,
  },
  ManualPlace: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'ManualPlace' : true,
    countryFlagIcon,
  },
}

export default resolvers
