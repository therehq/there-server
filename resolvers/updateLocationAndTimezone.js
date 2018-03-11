import getTimezoneAndLocation from '../helpers/google/getTzAndLoc'

export default async (obj, { placeId }, ctx) => {
  const { city, fullLocation, timezone } = await getTimezoneAndLocation(placeId)

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

  return res.get({ plain: true })
}
