import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { encode as jwtSimpleEncode } from 'jwt-simple'

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
