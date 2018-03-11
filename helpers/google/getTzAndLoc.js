import { client as mapsClient } from './maps'

export default async placeId => {
  const { json: { result } } = await mapsClient
    .place({
      placeid: placeId,
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
  const { json: { timeZoneId: timezone } } = await mapsClient
    .timezone({
      location: [lat, lng],
      timestamp: Date.now() / 1000,
    })
    .asPromise()

  // Return data in correct format
  return {
    city,
    fullLocation,
    timezone,
  }
}
