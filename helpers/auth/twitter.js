import { Strategy as TwitterStrategy } from 'passport-twitter'

// Utilities
import config from '../../utils/config'
import { User } from '../../models'

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env

export const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: `${config.apiUrl}/auth/twitter/callback`,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Normlize data
      const { displayName: fullName, photos, id: twitterId } = profile
      const [firstName, lastName] = fullName.split(' ', 2)
      const photoUrl =
        photos && photos.length > 0
          ? photos[0].value.replace('_normal', '_80x80')
          : ''

      // Get user data or create a new user
      const hasCreated = await User.insertOrUpdate({
        twitterId,
        firstName,
        lastName,
        fullName,
        photoUrl,
        twitterHandle: profile.username,
      })

      const user = await User.findOne({ where: { twitterId } })

      if (hasCreated) {
        await user.addFollowing(user.get('id'))
      }

      const plainUserData = user.get({ plain: true })
      return done(null, plainUserData)
    } catch (err) {
      console.error(err)
      return done(err)
    }
  },
)
