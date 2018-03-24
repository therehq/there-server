import { User } from '../models'
import getTimezoneAndLocation from '../helpers/google/getTzAndLoc'

export default async (obj, { placeId, userId }, ctx) => {
  const { city, fullLocation, timezone } = await getTimezoneAndLocation(placeId)

  // Check for signed in user
  if (!userId || !placeId) {
    throw new Error('Data missing')
  }

  // Update user with data!
  await User.update(
    {
      city,
      fullLocation,
      timezone,
    },
    { where: { id: userId } },
  )

  const res = await User.findById(userId)

  return res.get({ plain: true })
}
