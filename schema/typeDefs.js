// Small tag utitlity to enable Prettier & Syntax highlighting
const gql = String.raw

const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    getTitle: String
    user: User
    userId: ID
    getFollowingList: [Following]!
  }

  type Mutation {
    getTitle: String
    updateUser(email: String): User
    followUser(userId: ID!): User
  }

  # TYPES
  type User implements Following {
    id: ID
    photoUrl: String
    city: String
    fullLocation: String
    timezone: String
    ###
    twitterId: Int
    email: String
    firstName: String
    lastName: String
    twitterHandle: String
  }

  type ManualPerson implements Following {
    id: ID
    photoUrl: String
    city: String
    fullLocation: String
    timezone: String
    ###
    firstName: String
    lastName: String
    twitterHandle: String
  }

  type ManualPlace implements Following {
    id: ID
    photoUrl: String
    city: String
    fullLocation: String
    timezone: String
    ###
    name: String
  }

  # INTERFACES
  interface Following {
    id: ID
    photoUrl: String
    city: String
    fullLocation: String
    timezone: String
  }
`

export default typeDefs
