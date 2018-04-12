import { ManualPlace } from '../models'
import getTzAndLoc from '../helpers/google/getTzAndLoc'
import followingList from './followingList'

export default async (obj, args, ctx, info) => {
  const { name, placeId, photoUrl, photoCloudObject } = args

  // Find timezone and exact location based on placeId
  const { city, fullLocation, timezone } = await getTzAndLoc(placeId)

  // Create and save place
  const savedPlace = await ManualPlace.create({
    name,
    photoUrl,
    photoCloudObject,

    city,
    fullLocation,
    timezone,
  })

  await ctx.user.addManualPlace(savedPlace)

  return savedPlace.get({ plain: true })
}
