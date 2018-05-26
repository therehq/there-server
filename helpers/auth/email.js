import {
  encode as jwtSimpleEncode,
  decode as jwtSimpleDecode,
} from 'jwt-simple'
import v4 from 'uuid/v4'
import Raven from 'raven'

// Utilities
import { uploadToStorageFromUrl } from '../google/uploadToStorage'
import { getGravatarUrl } from '../gravatar'
import { mixpanel } from '../mixpanel'

// Models
import { User } from '../../models'

const { JWT_SECRET } = process.env

export const uploadGravatarToStorage = async (userId, email) => {
  let gravatar = getGravatarUrl(email, { size: 84, default: '404' })
  let photoCloudObject = null
  let photoUrl = null

  // Only try to upload photo if there is one
  if (gravatar) {
    // Upload photo to our storage
    try {
      // Set url and cloud object directly from the upload function
      ;({
        publicUrl: photoUrl,
        cloudObject: photoCloudObject,
      } = await uploadToStorageFromUrl(userId, gravatar))
    } catch (err) {
      if (err.message.includes('Request for fetching image failed')) {
        console.error(err)
        return
      }

      Raven.captureException(err)
      console.error(err)
    }
  }

  return { photoUrl, photoCloudObject }
}

export const signInUserByEmail = io => async (req, res, next) => {
  const { token, socketId } = req.query

  if (!token) {
    res.send('Something went wrong. Please copy the link carefully again.')
    return
  }

  let email
  try {
    ;({ email } = jwtSimpleDecode(token, JWT_SECRET))
  } catch (err) {
    console.log(err)
    res.send(
      `The verification link is only valid within 30 minutes of creation. If you believe it's not expired, probably the link isn't complete!`,
    )
    return
  }

  try {
    // Find the client to notify of result
    const socket = io.to(socketId)

    // Fetch user data if user is already saved in the DB
    const signedUpUser = await User.findOne({ where: { email } })

    // If user has already signed up, it's done
    if (signedUpUser) {
      req.user = signedUpUser.get({ plain: true })
      next()
      return
    }

    // Notify the user that we're registering them
    socket.emit('signingup')

    // Get user data or create a new user
    const userId = v4()

    // Upload the photo to our storage
    const { photoUrl, photoCloudObject } = await uploadGravatarToStorage(
      userId,
      email,
    )

    // Create user
    const user = await User.create({
      id: userId,
      email,
      photoUrl,
      photoCloudObject,
    })

    // Follow himself/herself
    await user.addFollowing(userId)

    // Track sign up
    try {
      mixpanel.track('Sign Up', {
        distinct_id: userId,
        method: 'email',
        email,
        userId,
      })
    } catch (err) {
      console.log(err)
    }

    // Pass user data
    req.user = user.get({ plain: true })
    next()
  } catch (err) {
    console.error(err)
    return next(err)
  }
}
