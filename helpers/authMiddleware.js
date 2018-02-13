import admin from 'firebase-admin'

const showUnathorizedError = res => {
  res.status(403).json({
    error: true,
    message: `Unauthorized! We did not recieve any info regarding who you are and how you used There app. Please contact support@there.pm`,
  })
}

export const auth = () => async (req, res, next) => {
  const token = req.headers['authorization']
  // Unauthorized check
  if (!token) {
    showUnathorizedError(res)
    return
  }

  // Token is provided
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    // Set uid on request object so we can access it in the next middleware
    req.uid = decodedToken.uid
    next()
  } catch (error) {
    showUnathorizedError(res)
    console.log('Token decoding attempt failed: ', error)
    return
  }
}
