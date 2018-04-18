import { Strategy as TwitterStrategy } from 'passport-twitter'
import Raven from 'raven'
import v4 from 'uuid/v4'

// Utilities
import config from '../../utils/config'
import { uploadToStorageFromUrl } from '../google/uploadToStorage'
import { mixpanel } from '../mixpanel'
import { User } from '../../models'

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env

/**
 * @param {SocketIO.Server} io
 */
export const twitterStrategy = io =>
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: `${config.apiUrl}/auth/twitter/callback`,
      passReqToCallback: true,
    },
    async (req, token, tokenSecret, profile, done) => {
      try {
        const socket = io.to(req.session.socketId)

        // Normlize data
        const { displayName: fullName, photos, id: twitterId } = profile
        const [firstName, lastName] = fullName.split(' ', 2)
        const twitterPhotoUrl =
          photos && photos.length > 0
            ? photos[0].value.replace('_normal', '_80x80')
            : ''

        // Fetch user data if user is already saved in the DB
        const signedUpUser = await User.findOne({ where: { twitterId } })

        if (signedUpUser) {
          const signedUpUserPlainData = signedUpUser.get({ plain: true })

          // If photo is from Twitter, we want to upload it to our storage
          const {
            photoUrl: currentPhotoUrl,
            id: userId,
          } = signedUpUserPlainData

          if (currentPhotoUrl && currentPhotoUrl.includes('twimg.com/')) {
            // Upload the photo if it is pointing to Twitter
            const newPhotoProps = await uploadTwitterPhotoToCloud(
              userId,
              currentPhotoUrl,
            )

            // Update user with the new photoUrl and photoCloudObject
            try {
              await signedUpUser.update(newPhotoProps)
            } catch (err) {}

            return done(null, { ...signedUpUserPlainData, ...newPhotoProps })
          } else {
            return done(null, signedUpUserPlainData)
          }
        }

        // Notify the user that we are registering them for
        // the first time so they know why it takes longer
        socket.emit('signingup')

        // Get user data or create a new user
        const userId = v4()

        // Upload the photo to our storage
        const { photoUrl, photoCloudObject } = await uploadTwitterPhotoToCloud(
          userId,
          twitterPhotoUrl,
        )

        // Sign up the user for the first time
        const user = await User.create({
          id: userId,
          twitterId,
          firstName,
          lastName,
          fullName,
          twitterHandle: profile.username,
          photoUrl,
          photoCloudObject,
        })

        // Follow himself/herself
        await user.addFollowing(userId)

        // Track sign up
        try {
          mixpanel.track('Sign Up', { userId, twitterHandle })
        } catch (err) {}

        // Return the user data
        const userPlainData = user.get({ plain: true })
        return done(null, userPlainData)
      } catch (err) {
        console.error(err)
        return done(err)
      }
    },
  )

const uploadTwitterPhotoToCloud = async (userId, twitterPhotoUrl) => {
  let photoCloudObject = null
  let photoUrl = twitterPhotoUrl

  // Only try to upload photo if there is one
  if (twitterPhotoUrl) {
    // Upload photo to our storage
    try {
      // Set url and cloud object directly from the upload function
      ;({
        publicUrl: photoUrl,
        cloudObject: photoCloudObject,
      } = await uploadToStorageFromUrl(userId, twitterPhotoUrl))
    } catch (err) {
      Raven.captureException(err)
      console.error(err)
    }
  }

  return { photoUrl, photoCloudObject }
}
