import { people } from './models'

const resolvers = {
  Query: { trackList: (obj, { userId }) => people },
  Mutation: {
    addPersonManually: (obj, args, ctx) => {},
  },
}

export default resolvers
