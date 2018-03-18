import getFieldNames from 'graphql-list-fields'
import { flag } from 'country-emoji'

export default async (obj, args, ctx, info) => {
  // Check what fields are requested
  const fields = getFieldNames(info)
  const needsPeople = Boolean(fields.find(f => f.startsWith(`people`)))
  const needsPlaces = Boolean(fields.find(f => f.startsWith(`places`)))

  // Prepare queries we might execute
  // (we need to wrap them in functions or
  // they'll fire right away!)
  const followingUsers = () =>
    ctx.user.getFollowing({
      order: [['createdAt', 'ASC']],
    })
  const manualPeople = () =>
    ctx.user.getManualPeople({
      order: [['createdAt', 'ASC']],
    })
  const manualPlaces = () =>
    ctx.user.getManualPlaces({
      order: [['createdAt', 'ASC']],
    })

  let wrappedFollowings, wrappedManualPeople, wrappedManualPlaces
  // Fetch only the required data by the user
  if (needsPeople && needsPlaces) {
    // Fetch both
    ;[
      wrappedFollowings,
      wrappedManualPeople,
      wrappedManualPlaces,
    ] = await Promise.all([followingUsers(), manualPeople(), manualPlaces()])
  } else if (needsPeople && !needsPlaces) {
    // Fetch only people
    ;[wrappedFollowings, wrappedManualPeople] = await Promise.all([
      followingUsers(),
      manualPeople(),
    ])
  } else if (needsPlaces && !needsPeople) {
    // Fetch only places
    wrappedManualPlaces = await manualPlaces()
  }

  const people = needsPeople && [
    ...wrappedFollowings.map(wrapped => {
      const following = wrapped.get({ plain: true })
      // Privacy!
      delete following.email
      delete following.twitterId
      following.__resolveType = 'User'
      return following
    }),
    ...wrappedManualPeople.map(wrapped => {
      const person = wrapped.get({ plain: true })
      person.__resolveType = 'ManualPerson'
      return person
    }),
  ]

  const places =
    needsPlaces &&
    wrappedManualPlaces.map(wrapped => {
      const place = wrapped.get({ plain: true })

      if (!place.photoUrl && place.fullLocation) {
        // Add the flag if it has no phFolloto
        const locationParts = place.fullLocation.split(',')
        const countryName = locationParts[locationParts.length - 1]
        place.countryFlag = flag(countryName)
      }

      place.__resolveType = 'ManualPlace'
      return place
    })

  const followings = { places, people }
  return followings
}
