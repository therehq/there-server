import { makeExecutableSchema } from 'graphql-tools'

import resolvers from '../resolvers'
import typeDefs from './typeDefs'
import * as OrmModels from '../models'
import { asyncErrorHandler } from '../helpers/errors'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export const models = OrmModels

// Fetch current logged in user a single time,
// so we don't refetch it in every resolver
export const getUser = asyncErrorHandler(
  async userId => await OrmModels.User.findById(userId),
)
