// Small tag utitlity to enable Prettier & Syntax highlighting
const gql = String.raw

const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    trackList(userId: String): [Person]!
    title: String!
  }

  type Mutation {
    addPersonManually(
      trackerUid: ID!
      name: String!
      location: String
      twitter: String
    ): Person
    changeTitle(title: String): String
  }

  # TYPES
  type User implements UserInterface {
    uid: ID
    firstName: String
    lastName: String
    nickname: String
    photoUrl: String
    timezone: String
    location: Location
  }

  type Person implements UserInterface {
    twitter: String
  }

  type Location {
    """
    City, State/Province, Country
    """
    description: String
    """
    City
    """
    lastTerm: String
  }

  # INTERFACES
  interface UserInterface {
    uid: ID!
    firstName: String
    lastName: String
    timezone: String
    location: Location
    photoUrl: String
  }
`

export default typeDefs
