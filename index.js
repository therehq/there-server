import 'now-env'
import express from 'express'
import bodyParser from 'body-parser'
import PrettyError from 'pretty-error'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import playgroundExpress from 'graphql-playground-middleware-express'
import helmet from 'helmet'
import chalk from 'chalk'
import Raven from 'raven'
import cors from 'cors'

// Local
import { twitterStrategy } from './helpers/passport'
import { schema, connectors, models } from './schema'
import { connectToDb } from './models'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 9900
const app = express()

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

// Enable Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Setup Passport for authentication

// Connect to database
connectToDb()

// Initialize GraphQL endpoint
app.use(
  '/graphql',
  graphqlExpress(req => ({
    schema,
    context: {
      uid: req.uid,
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
app.listen(port, () =>
  console.log(
    `😻 ${chalk.green`Woot!`} Server started at http://localhost:${port}`,
  ),
)
