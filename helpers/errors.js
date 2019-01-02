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

  if (!err) {
    return next()
  }

  const id = Raven.captureException(err)

  res
    .status(500)
    .send(
      `Oops, something went wrong! Our engineers have been alerted and will fix this asap. (Error Id : ${id})<br /><small>Chat support is online: <a href="https://go.crisp.chat/chat/embed/?website_id=bb14ccd2-0869-40e7-b0f1-b520e93db7e1">https://go.crisp.chat/chat/embed/?website_id=bb14ccd2-0869-40e7-b0f1-b520e93db7e1</a></small>`,
    )
}
