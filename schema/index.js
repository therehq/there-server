import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'
import typeDefs from './typeDefs'
import { Models } from './models'
import { FirebaseConnector } from '../utils/firebase'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// Initilize Firebase connector (The one and only connector for now!)
const firebase = new FirebaseConnector()

export const connectors = {
  firebase,
}

export const models = new Models({ firebase })
