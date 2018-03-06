export default async (obj, args, ctx) => {
  const googleMaps = require('@google/maps').createClient({
    key: process.env.GOOGLE_API_KEY,
    Promise: global.Promise,
  })

  const { json: { result } } = await googleMaps
    .place({
      placeid: args.placeId,
      language: 'en',
    })
    .asPromise()

  // Extract and rename information for saving in database
  const {
    name: city,
    formatted_address: fullLocation,
    geometry: { location: { lat, lng } },
  } = result

  // Fetch timezone string based on geometry (Lat/Lng)
  const { json: { timeZoneId: timezone } } = await googleMaps
    .timezone({
      location: [lat, lng],
      timestamp: Date.now() / 1000,
    })
    .asPromise()

  // Check for signed in user
  if (!ctx.user) {
    throw new Error('Unauthorized')
  }

  // Update user with data!
  const res = await ctx.user.update({
    city,
    fullLocation,
    timezone,
  })
  console.log(res.get({ plain: true }))

  return res.get({ plain: true })
}
