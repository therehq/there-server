const resolvers = {
  Query: {
    trackList: (obj, { userId }) => [],
    title: () => {
      console.log('requested title')
      return 'There title'
    },
  },
  Mutation: {
    addPersonManually: async (obj, args, ctx) =>
      console.log(await ctx.models.User.findAll()),
  },
}

export default resolvers
