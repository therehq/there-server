// Queries
import followingList from './followingList'
import pinnedList from './pinnedList'
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
import updateTimezone from './updateTimezone'
import removeManualPerson from './removeManualPerson'
import removeManualPlace from './removeManualPlace'
import pinManualPerson from './pinManualPerson'
import unpinManualPerson from './unpinManualPerson'
import pinManualPlace from './pinManualPlace'
import unpinManualPlace from './unpinManualPlace'
import pinUser from './pinUser'
import unpinUser from './unpinUser'
import sortFollowings from './sortFollowings'
import updateManualPerson from './updateManualPerson'
import updateManualPlace from './updateManualPlace'

// Method
import countryFlagIcon from './countryFlagIcon'
import countryFlagEmoji from './countryFlagEmoji'

const resolvers = {
  Query: {
    title: () => 'There PM!',
    userId: async (obj, args, ctx) => ctx.userId,
    user: (obj, args, ctx) => ctx.user.get(),
    followingList,
    pinnedList,
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
    updateTimezone,
    removeManualPerson,
    removeManualPlace,
    pinManualPerson,
    pinManualPlace,
    pinUser,
    unpinManualPerson,
    unpinManualPlace,
    unpinUser,
    followingList,
    sortFollowings,
    updateManualPerson,
    updateManualPlace,
  },

  User: (...props) => {
    console.log(props)
  },

  // TYPES
  User: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'User' : true,
    countryFlag: countryFlagEmoji,
    countryFlagEmoji,
    countryFlagIcon,
  },
  ManualPerson: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'ManualPerson' : true,
    countryFlag: countryFlagEmoji,
    countryFlagEmoji,
    countryFlagIcon,
  },
  ManualPlace: {
    __isTypeOf: ({ __resolveType }) =>
      __resolveType ? __resolveType === 'ManualPlace' : true,
    countryFlag: countryFlagEmoji,
    countryFlagEmoji,
    countryFlagIcon,
  },
}

export default resolvers
