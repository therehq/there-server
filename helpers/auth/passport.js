import passport from 'passport'

// Local
import { twitterStrategy } from './twitter'
import { jwtStrategy, encodeJwt } from './jwt'
import { serializeUser, deserializeUser } from './session'
import { generateRandomPhrase } from '../../utils/randomPhrase'
import {
  encode as jwtSimpleEncode,
  decode as jwtSimpleDecode,
} from 'jwt-simple'
import config from '../../utils/config'
import { User } from '../../models'
import { uploadGravatarToStorage, signInUserByEmail } from './email'

const { JWT_SECRET } = process.env

/**
 * Setup authentication with PassportJS
 *
 * @param {Express} app
 * @param {SocketIO.Server} io
 */
export const setupPassportAuth = (app, io) => {
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  passport.use(twitterStrategy(io))
  passport.use(jwtStrategy)

  app.use(passport.initialize())
  app.use(passport.session())

  ///////// TWITTER ///////////
  app.get(
    '/auth/twitter',
    // Save socketId in the session
    (req, res, next) => {
      req.session.socketId = req.query.socketId
      next()
    },
    passport.authenticate('twitter'),
  )
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter'),
    async (req, res) => {
      // Get client's socketId from session
      const socket = io.to(req.session.socketId)
      // Check if sign in failed
      if (!req.user && !req.user.id) {
        socket.emit('signin-failed')
        // Wait to finish socket
        await sleep(200)
        res.send(`<script>window.close();</script>`)
        return
      }
      // Then it was successful...
      // Generate JWT token
      const jwtToken = encodeJwt(req.user.id)
      // Send token to client
      socket.emit('signin-succeeded', { jwtToken, user: req.user })
      // Wait to finish socket
      await sleep(200)
      // And close the window
      res.send(`<script>window.close();</script>`)
    },
  )

  ///////// EMAIL ///////////
  app.post('/auth/email', (req, res) => {
    const { email, socketId } = req.body

    // Check for socketId to save for use in callback later
    if (!socketId) {
      res.json({
        sent: false,
        message: 'No socket. Live support at there.pm',
      })
      return
    }

    if (email) {
      const securityCode = generateRandomPhrase()
      const token = jwtSimpleEncode({ email: email.toLowerCase() }, JWT_SECRET)
      const callbackUrl = `${
        config.apiUrl
      }/auth/email/callback?socketId=${socketId}&token=${token}`

      // TODO: Send email
      console.log(
        `Log on by email, securityCode: ${securityCode}, callbackUrl: ${callbackUrl}`,
      )

      res.json({ sent: true, securityCode })
    } else {
      res.json({ sent: false, message: 'No email provided.' })
    }
  })
  app.get('/auth/email/callback', signInUserByEmail(io), async (req, res) => {
    // Get client's socketId from session
    const socket = io.to(req.query.socketId)
    // Check if sign in failed
    if (!req.user && !req.user.id) {
      socket.emit('signin-failed')
      // Wait to finish socket
      await sleep(200)
      res.send(`<script>window.close();</script>`)
      return
    }
    // Then it was successful...
    // Generate JWT token
    const jwtToken = encodeJwt(req.user.id)
    // Send token to client
    socket.emit('signin-succeeded', { jwtToken, user: req.user })
    // Wait to finish socket
    await sleep(200)
    // And close the window
    res.send(`<script>window.close();</script>`)
  })

  ///////// JWT ///////////
  app.get('/auth/jwt', passport.authenticate('jwt'), (req, res) => {
    res.send(`userId: ${req.userId}`)
  })
}

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
