import 'now-env'
import http from 'http'
import socket from 'socket.io'
import express from 'express'
import bodyParser from 'body-parser'
import PrettyError from 'pretty-error'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import playgroundExpress from 'graphql-playground-middleware-express'
import cookieSession from 'cookie-session'
import passport from 'passport'
import helmet from 'helmet'
import chalk from 'chalk'
import Raven from 'raven'
import cors from 'cors'

// Local
import { setupPassportAuth } from './helpers/auth/passport'
import { schema, models, getUser } from './schema'
import { connectToDb } from './models'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 9900

// Create server
const app = express()
const server = http.createServer(app)

// Prettify console errors (for development)
const pe = new PrettyError()
pe.start()

// Sentry
if (!dev) {
  Raven.config(process.env.SENTRY_DSN).install()
  app.use(Raven.requestHandler()) // Must be the first middleware
}

// Setting various HTTP headers for security
app.use(helmet())

// Enable CORS with customized options
app.use(cors())

// Cookie Session
app.set('trust proxy', 1)
app.use(
  cookieSession({
    name: 'there-server',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    overwrite: true,
  }),
)

// Enable Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Socket Server
const io = socket(server)
io.on('connection', () => {
  console.log('socket connected!')
})

// Setup Passport for authentication
setupPassportAuth(app, io)

// Connect to database
connectToDb()

// Initialize GraphQL endpoint
app.use(
  '/graphql',
  passport.authenticate('jwt'),
  graphqlExpress(async ({ userId }) => ({
    schema,
    context: {
      userId,
      user: await getUser(userId),
      models,
    },
  })),
)
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.get('/playground', playgroundExpress({ endpoint: '/graphql' }))

// API Welcome message for strangers!
app.get('/', (req, res) => {
  res.send(
    'There™ API With ☘️ &nbsp;Graphcool Projects And 👻 &nbsp;Apollo Powered by ▲ ZEIT Now',
  )
})

// Raven error handler (must be before other error handlers)
if (!dev) {
  app.use(Raven.errorHandler())
}

// Kick-start server and begin the journey (Bugs, yay!)
server.listen(port, () =>
  console.log(
    `😻 ${chalk.green`Woot!`} Server started at http://localhost:${port}`,
  ),
)
