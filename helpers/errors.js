import Raven from 'raven'

/**
 *
 * @param {Function} children
 */
export const asyncErrorHandler = children => (...args) => {
  try {
    return children(...args)
  } catch (e) {
    Raven.captureException(e)
    console.error(e)
    return
  }
}

export const capture = Raven.captureException

export const expressJsonErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).json({
    error: err.message,
  })
}
