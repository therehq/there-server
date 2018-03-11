import { ManualPlace } from '../models'
import getTzAndLoc from '../helpers/google/getTzAndLoc'

export default async (obj, { name, placeId, photoUrl }, ctx) => {
  // Find timezone and exact location based on placeId
  const { city, fullLocation, timezone } = await getTzAndLoc(placeId)

  // Create and save place
  const savedPlace = await ManualPlace.create({
    name,
    photoUrl,

    city,
    fullLocation,
    timezone,
  })

  await ctx.user.addManualPlace(savedPlace)

  return savedPlace.get({ plain: true })
}
