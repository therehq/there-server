import http from 'http'
import path from 'path'
import socket from 'socket.io'
import express from 'express'
import bodyParser from 'body-parser'
import PrettyError from 'pretty-error'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import playgroundExpress from 'graphql-playground-middleware-express'
import cookieSession from 'cookie-session'
import passport from 'passport'
import fetch from 'node-fetch'
import helmet from 'helmet'
import chalk from 'chalk'
import Raven from 'raven'
import cors from 'cors'

// Local
import { mixpanel } from './helpers/mixpanel'
import { setupPassportAuth } from './helpers/auth/passport'
import { getLatestReleaseDlLink } from './helpers/github'
import { schema, models, getUser } from './schema'
import { redirectToCorrectAPIVersion } from './helpers/versions'
import { parseUserIdIfAuthorized } from './helpers/auth/jwt'
import { expressJsonErrorHandler } from './helpers/errors'
import { connectToDb } from './models'
import { version } from './package'
import restApi from './helpers/rest'
import config from './utils/config'
import analyticsHandler from './helpers/analytics'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 9900

// Create server
const app = express()
const server = http.createServer(app)

// Prettify console errors (for development)
const pe = new PrettyError()
pe.start()

// Sentry
Raven.config(process.env.SENTRY_DSN).install()
app.use(Raven.requestHandler()) // Must be the first middleware

// Setting various HTTP headers for security
app.use(helmet())

// Enable CORS with customized options
app.use(cors())

// Static assets
app.use('/static/assets', express.static('./static/assets'))
app.use(
  `/static/assets/country-flags-${config.countryFlagsHash}`,
  express.static('./static/assets/country-flags', { maxAge: '1yr' }),
)

// Views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

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

// Redirect in case of an old version
app.use(redirectToCorrectAPIVersion)

// Connect to database
connectToDb()

// Initialize GraphQL endpoint
app.use(
  '/graphql',
  passport.authenticate('jwt'),
  graphqlExpress(async req => ({
    schema,
    context: {
      userId: req.userId,
      user: await getUser(req.userId),
      models,
    },
    formatError: error => {
      if (error.path || error.name !== 'GraphQLError') {
        console.error(error)
        Raven.captureException(error, {
          extra: {
            source: error.source && error.source.body,
            positions: error.positions,
            path: error.path,
            stack: error.stack.split('\n'),
          },
        })
      } else {
        console.error(error.message)
        Raven.captureMessage(`GraphQLWrongQuery: ${error.message}`, {
          extra: {
            source: error.source && error.source.body,
            positions: error.positions,
            stack: error.stack.split('\n'),
          },
        })
      }
      return {
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack.split('\n')
            : null,
      }
    },
  })),
)
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
app.get('/playground', playgroundExpress({ endpoint: '/graphql' }))

// Routes
app.use('/rest', restApi)
app.use('/analytics', analyticsHandler) // Deprecated
app.get('/download/macos', (req, res) => {
  // Desktop app download link
  getLatestReleaseDlLink()
    .then(link => res.redirect(link))
    .catch(err => {
      res.status(404).send(err.message)
      Raven.captureException(err)
    })

  // Track downloads
  mixpanel.track('Download macOS', { ip: req.ip })
})

// API Welcome message for strangers!
app.get('/', (req, res) => {
  res.send(
    `There™ API v${version} With ☘️ &nbsp;Graphcool Projects And 👻 &nbsp;Apollo Powered by ▲ ZEIT Now`,
  )
})

// Raven error handler (must be before other error handlers)
if (!dev) {
  app.use(Raven.errorHandler())
}

app.use(expressJsonErrorHandler)

// Kick-start server and begin the journey (Bugs, yay!)
server.listen(port, () =>
  console.log(
    `😻 ${chalk.green`Woot!`} Server started at http://localhost:${port}`,
  ),
)

// From withspectrum/spectrum
process.on('unhandledRejection', async err => {
  console.error('Unhandled rejection', err)
  try {
    await new Promise(resolve => Raven.captureException(err, resolve))
  } catch (err) {
    console.error('Raven error', err)
  } finally {
    process.exit(1)
  }
})

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err)
  try {
    await new Promise(resolve => Raven.captureException(err, resolve))
  } catch (err) {
    console.error('Raven error', err)
  } finally {
    process.exit(1)
  }
})
