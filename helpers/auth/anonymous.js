import v4 from 'uuid/v4'

// Utilities
import { mixpanel } from '../mixpanel'
import { encodeJwt } from './jwt'

// Models
import { User } from '../../models'

export const loginAnonymously = async (req, res, next) => {
  try {
    // Gen a new userId
    const userId = v4()

    const token = encodeJwt(userId)

    // Create user
    const user = await User.create({
      id: userId,
      isAnonymous: true,
    })

    // Track sign up
    try {
      mixpanel.track('Sign Up', {
        distinct_id: userId,
        method: 'anonymous',
      })
    } catch (err) {
      console.log(err)
    }

    // Pass user data
    req.user = user.get({ plain: true })

    res.json({ token, user })
    // next()
  } catch (err) {
    console.error(err)
    return next(err)
  }
}
