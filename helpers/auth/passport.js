import passport from 'passport'

// Local
import { twitterStrategy } from './twitter'
import { jwtStrategy, encodeJwt } from './jwt'
import { serializeUser, deserializeUser } from './session'

/**
 * Setup authentication with PassportJS
 *
 * @param {Express} app
 */
export const setupPassportAuth = app => {
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  passport.use(twitterStrategy)
  passport.use(jwtStrategy)

  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/auth/twitter', passport.authenticate('twitter'))
  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter'),
    (req, res) => {
      res.json({ jwtToken: encodeJwt(req.user.id) })
    },
  )

  app.get('/auth/jwt', passport.authenticate('jwt'), (req, res) => {
    res.send(`userId: ${req.userId}`)
  })
}
