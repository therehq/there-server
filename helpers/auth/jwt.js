import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import {
  encode as jwtSimpleEncode,
  decode as jwtSimpleDecode,
} from 'jwt-simple'
import Raven from 'raven'

const { JWT_SECRET } = process.env

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    ignoreExpiration: true,
    passReqToCallback: true,
  },
  (req, jwtPayload, done) => {
    req.userId = jwtPayload.userId
    return done(null, { id: jwtPayload.userId })
  },
)

export const encodeJwt = userId => jwtSimpleEncode({ userId }, JWT_SECRET)

export const parseUserIdIfAuthorized = (req, res, next) => {
  const { authorization } = req.headers

  // If request is not authorized, skip!
  if (
    !authorization ||
    !authorization.includes('Bearer') ||
    authorization.toLowerCase().includes('null')
  ) {
    next()
    return
  }

  try {
    const token = authorization.trim().split(' ')[1]

    if (token.split('.').length !== 3) {
      // Token is invalid
      // https://stackoverflow.com/a/38712298/4726475
      next()
    }

    const payload = jwtSimpleDecode(token, JWT_SECRET)

    if (payload && payload.userId) {
      req.userId = payload.userId
    }
  } catch (err) {
    Raven.captureException(err)
  } finally {
    next()
  }
}
