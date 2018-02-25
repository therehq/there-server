import { makeExecutableSchema } from 'graphql-tools'

import resolvers from '../resolvers'
import typeDefs from './typeDefs'
import * as OrmModels from '../models'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export const models = OrmModels
