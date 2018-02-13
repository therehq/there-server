import admin from 'firebase-admin'
import Raven from 'raven'

const showUnathorizedError = res => {
  res.status(403).json({
    error: true,
    message: `Unauthorized! We did not recieve any info regarding who you are and how you used There app. Please contact support@there.pm`,
  })
}

export const auth = () => async (req, res, next) => {
  const tokenHeader = req.headers.authorization
  // Unauthorized check
  if (!tokenHeader) {
    showUnathorizedError(res)
    return
  }

  // Token is provided
  // Parse token from the header
  const headerArray = tokenHeader.split(' ')
  const token = headerArray.length === 2 ? headerArray[1] : ''

  // Decode token and extract `uid`
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    // Set uid on request object so we can access it in the next middleware
    req.uid = decodedToken.uid
    next()
  } catch (error) {
    showUnathorizedError(res)
    Raven.captureException(error)
    console.log('Token decoding attempt failed: ', error)
    return
  }
}
