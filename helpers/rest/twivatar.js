import cheerio from 'cheerio'
import Debug from 'debug'
import bent from 'bent'
const getString = bent('string')

const debug = Debug('twivatar')
const oneMonthInSec = 2628000

const get = username => {
  const url = 'https://mobile.twitter.com/' + username
  return new Promise((resolve, reject) => {
    getString(url)
      .then(body => {
        const $ = cheerio.load(body)

        resolve(
          ($('.avatar img').attr('src') || '').replace('_normal', '_80x80'),
        )
      })
      .catch(reject)
  })
}

export default async (req, res, next) => {
  let imageUrl
  try {
    imageUrl = await get(req.params.user)
  } catch (error) {
    console.warn(error)
  }

  debug(`Fetching Twitter avatar for ${req.params.user}...`)

  if (!imageUrl) {
    return res.status(404).send('')
  }

  res.setHeader('Cache-Control', `public, max-age=${oneMonthInSec}`)

  const stream = await bent()(imageUrl)
  stream.pipe(res)
}
