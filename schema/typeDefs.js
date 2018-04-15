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
    manualPerson(id: ID): ManualPerson
    manualPlace(id: ID): ManualPlace
  }

  type Mutation {
    getTitle: String
    refresh: Refresh!
    followingList: Followings!

    updateLocationAndTimezone(placeId: ID!): User
    updateLocationAndTimezoneForUser(placeId: ID!, userId: ID!): User
    updateUser(
      email: String
      displayFormat: String
      showLocationPolicy: String
    ): User
    followUser(userId: ID!): User!
    unfollow(userId: ID!): User

    addManualPlace(
      name: String!
      placeId: ID!
      photoUrl: String
      photoCloudObject: String
    ): ManualPlace!
    updateManualPlace(
      id: ID!
      name: String!
      placeId: ID # It's not required for update
      photoUrl: String
      photoCloudObject: String
    ): ManualPlace
    removeManualPlace(id: ID!): ManualPlace

    addManualPerson(
      firstName: String!
      lastName: String
      placeId: ID!
      twitterHandle: String
      photoUrl: String
      photoCloudObject: String
    ): ManualPerson!
    updateManualPerson(
      id: ID!
      firstName: String!
      lastName: String
      placeId: ID # It's not required for update
      twitterHandle: String
      photoUrl: String
      photoCloudObject: String
    ): ManualPerson
    removeManualPerson(id: ID!): ManualPerson

    sortFollowings(peopleIds: [ID!], placesIds: [ID!]): Followings!
  }

  # TYPES
  type Followings {
    people: [Following]!
    places: [Following]!
  }

  type User implements Following {
    id: ID
    city: String
    fullLocation: String
    timezone: String
    photoUrl: String
    photoCloudObject: String
    ###
    twitterId: Int
    displayFormat: String
    showLocationPolicy: String
    ###
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
    photoCloudObject: String
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
    photoCloudObject: String
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

  type Refresh {
    id: String
  }

  # INTERFACES
  interface Following {
    id: ID
    photoUrl: String
    photoCloudObject: String
    city: String
    fullLocation: String
    timezone: String
  }

  # SCALARS
  scalar Date
`

export default typeDefs
