import { Strategy as TwitterStrategy } from 'passport-twitter'

import { User } from '../models'
const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env

export const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback',
  },
  async (token, tokenSecret, profile, cb) => {
    console.log(profile.id)
    try {
      const { user, hasCreated } = await User.findOrCreate({
        where: { username: 'sdepold' },
        defaults: { job: 'Technical Lead JavaScript' },
      })
      console.log({ user, hasCreated })
    } catch (e) {
      console.log(e)
    }
  },
)
