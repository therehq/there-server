import { Strategy as TwitterStrategy } from 'passport-twitter'

import { User } from '../../models'
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env

export const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:9900/auth/twitter/callback',
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Normlize data
      const [firstName, lastName] = profile.displayName.split(' ', 2)
      const photoUrl =
        profile.photos && profile.photos.length > 0
          ? profile.photos[0].value.replace('_normal', '_80x80')
          : ''

      // Get user data or create a new user
      const [data, hasCreated] = await User.findOrCreate({
        where: { twitterId: profile.id },
        defaults: {
          firstName,
          lastName,
          photoUrl,
          twitterHandle: profile.username,
        },
      })

      const user = data.dataValues
      return done(null, user)
    } catch (err) {
      console.error(err)
      return done(err)
    }
  },
)
