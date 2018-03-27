import Express from 'express'
import semver from 'semver'
import qs from 'qs'

const mapVersionRangeToApiUrl = {
  // Supports old followingList model w/o
  // people and places division
  '<=1.2.5': `https://there-server-aohygjtioa.now.sh`,

  // Nothing changes, just to keep track
  // '1.3.0 || 1.3.1': `https://there-server-qtrmrnbmec.now.sh`,
}

/**
 * If app requires an older API version,
 * redirect it to the correct API endpoint
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export const redirectToCorrectAPIVersion = (req, res, next) => {
  let userAgent = req.headers['user-agent'] || ''
  userAgent = userAgent.toLowerCase()

  // Sample user agent from Electron app:
  // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) There/1.8.4 Chrome/59.0.3071.115 Electron/1.8.4 Safari/537.36

  if (!userAgent.includes(' electron/')) {
    next()
    return
  }

  const versionString = userAgent.split(' there/')[1].split(' ')[0]

  for (let range in mapVersionRangeToApiUrl) {
    const matchesRange = semver.satisfies(versionString, range)

    // If we match one range, it should redirect...
    if (matchesRange) {
      const hostToRedirect = mapVersionRangeToApiUrl[range]
      // Construct the new API endpoint on top of the specified host
      const urlToRedirect = changeRequestUrlHost(req, hostToRedirect)
      // 307 redirect transfers post request body by standard
      console.log(`redirecting to ${urlToRedirect} ...`)
      res.redirect(307, urlToRedirect)
      return
    }
  }

  // If it didn't match any condition, continute
  // with the latest (current) endpoint
  next()
}

/**
 * Add the url query and pathname to the specified baseUrl
 * @param {Express.Request} req
 * @param {string} baseUrl - e.g. https://api.there.pm
 */
function changeRequestUrlHost(req, baseUrl) {
  const { url, query } = req
  const stringQuery = qs.stringify(query, {
    addQueryPrefix: true,
    encode: true,
  })
  return `${baseUrl}${url}${stringQuery}`
}
