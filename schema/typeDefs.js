// Small tag utitlity to enable Prettier & Syntax highlighting
const gql = String.raw

const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    title: String
    user: User
    userId: ID
    followingList: Followings!
    placesAutoComplete(query: String!): [PlacePrediction]!
    allUsersByName(name: String!, limit: Int): [User]!
  }

  type Mutation {
    getTitle: String
    followingList: Followings!
    updateUser(email: String): User
    updateLocationAndTimezone(placeId: ID!): User
    followUser(userId: ID!): User!
    addManualPlace(name: String!, placeId: ID!, photoUrl: String): ManualPlace!
    addManualPerson(
      firstName: String!
      lastName: String
      placeId: ID!
      twitterHandle: String
      photoUrl: String
    ): ManualPerson!
    unfollow(userId: ID!): User
    removeManualPerson(id: ID!): ManualPerson
    removeManualPlace(id: ID!): ManualPlace
    sortFollowings(peopleIds: [ID!], placesIds: [ID!]): Followings!
  }

  # TYPES
  type Followings {
    people: [Following]!
    places: [Following]!
  }

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
    fullName: String
    twitterHandle: String
    countryFlag: String
    ###
    createdAt: Date
    updatedAt: Date
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
    countryFlag: String
  }

  type PlacePrediction {
    description: String
    placeId: String
  }

  # INTERFACES
  interface Following {
    id: ID
    photoUrl: String
    city: String
    fullLocation: String
    timezone: String
  }

  # SCALARS
  scalar Date
`

export default typeDefs
