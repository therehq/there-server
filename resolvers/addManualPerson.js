import Raven from 'raven'

import { ManualPerson } from '../models'
import getTzAndLoc from '../helpers/google/getTzAndLoc'
import followingList from './followingList'

export default async (
  obj,
  {
    firstName,
    lastName,
    twitterHandle,
    placeId,
    timezone: inputTimezone,
    photoUrl,
    photoCloudObject,
  },
  ctx,
  info,
) => {
  // Find timezone and exact location based on placeId
  let { city, fullLocation, timezone } = await getTzAndLoc(placeId)

  // For UTC
  if (!placeId && !city && inputTimezone) {
    city = null
    fullLocation = null
    timezone = inputTimezone
  }
  // Create and save place
  const savedPerson = await ManualPerson.create({
    firstName,
    lastName,
    twitterHandle,
    photoUrl,
    photoCloudObject,

    city,
    fullLocation,
    timezone,
  })

  try {
    await ctx.user.addManualPerson(savedPerson)
  } catch (err) {
    Raven.captureException(err)
    console.log(err)
    return err
  }

  return savedPerson.get({ plain: true })
}
