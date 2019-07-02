import { ManualPlace } from '../models'

// Utilities
import getTzAndLoc from '../helpers/google/getTzAndLoc'

export default async (obj, args, ctx) => {
  if (!args.id) {
    throw new Error('No ID was specified.')
  }

  const { id, placeId, timezone: inputTimezone, ...newValues } = args

  if (Boolean(placeId)) {
    // Only update location if it has been changed
    const { city, fullLocation, timezone } = await getTzAndLoc(placeId)
    // Set location/timezone values to be updated
    newValues.city = city
    newValues.timezone = timezone
    newValues.fullLocation = fullLocation
  }

  // UTC
  if (Boolean(inputTimezone)) {
    newValues.timezone = inputTimezone
  }

  const [affected] = await ManualPlace.update(newValues, {
    where: { id },
  })

  if (affected === 1) {
    // We don't fetch from DB here, later if we had a
    // better caching in the app, we should return the
    // new row
    return newValues
  }

  // Nothing affected
  return null
}
