export default async (obj, args, ctx) => {
  try {
    const googleMaps = require('@google/maps').createClient({
      key: process.env.GOOGLE_API_KEY,
      Promise: global.Promise,
    })

    const { json: { predictions } } = await googleMaps
      .placesAutoComplete({
        input: args.query,
        language: 'en',
        types: '(cities)',
      })
      .asPromise()

    if (typeof predictions !== 'undefined' && predictions.length > 0) {
      return predictions.map(({ description, place_id }) => {
        return { description, placeId: place_id }
      })
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}
