import qs from 'qs'
import crypto from 'crypto'

const BASE_URL = 'https://gravatar.com/avatar/'

export const getGravatarUrl = (email, opts) => {
  if (email.indexOf('@') === -1) {
    throw new Error('Please specify an email')
  }

  const query = qs.stringify(opts)
  const neatEmail = email.toLowerCase().trim()
  const hash = crypto
    .createHash('md5')
    .update(neatEmail)
    .digest('hex')

  return BASE_URL + `${hash}.jpg` + (query ? `?${query}` : '')
}
