import cheerio from 'cheerio'
import request from 'request'
import Debug from 'debug'

const debug = Debug('twivatar')
const oneMonthInSec = 2628000

const get = username => {
  const url = 'https://mobile.twitter.com/' + username
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      const $ = cheerio.load(body)

      resolve(($('.avatar img').attr('src') || '').replace('_normal', '_80x80'))
    })
  })
}

export default async (req, res, next) => {
  const result = await get(req.params.user)

  debug(`Fetching Twitter avatar for ${req.params.user}...`)

  if (!result) {
    return next(404)
  }

  res.setHeader('Cache-Control', `public, max-age=${oneMonthInSec}`)
  request(result).pipe(res)
}
