import passport from 'passport'

// Local
import { twitterStrategy } from './twitter'
import { jwtStrategy, encodeJwt } from './jwt'
import { serializeUser, deserializeUser } from './session'

/**
 * Setup authentication with PassportJS
 *
 * @param {Express} app
 * @param {SocketIO.Server} io
 */
export const setupPassportAuth = (app, io) => {
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  passport.use(twitterStrategy)
  passport.use(jwtStrategy)

  app.use(passport.initialize())
  app.use(passport.session())

  app.get(
    '/auth/twitter',
    // Save socketId in the session
    (req, res, next) => {
      req.query.socketId
      req.session.socketId = req.query.socketId
      next()
    },
    passport.authenticate('twitter'),
  )
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter'),
    (req, res) => {
      // Get client's socketId from session
      const socket = io.to(req.session.socketId)
      // Check if sign in failed
      if (!req.user && !req.user.id) {
        socket.emit('signin-failed')
      }
      // Then it was successful...
      // Generate JWT token
      const jwtToken = encodeJwt(req.user.id)
      // Send token to client
      socket.emit('signin-succeeded', { jwtToken, user: req.user })
      // And close the window
      res.send(`<script>window.close();</script>`)
    },
  )

  app.get('/auth/jwt', passport.authenticate('jwt'), (req, res) => {
    res.send(`userId: ${req.userId}`)
  })
}
