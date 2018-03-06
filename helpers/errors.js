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
