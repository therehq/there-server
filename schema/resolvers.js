import { people } from './models'

const resolvers = {
  Query: {
    trackList: (obj, { userId }) => people,
    title: () => 'There Title',
  },
  Mutation: {
    addPersonManually: (obj, args, ctx) => {},
  },
}

export default resolvers
