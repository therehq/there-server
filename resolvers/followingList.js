import { flag } from 'country-emoji'

export default async (obj, args, ctx) => {
  const [wrappedFollowings, wrappedPeople, wrappedPlaces] = await Promise.all([
    ctx.user.getFollowing(),
    ctx.user.getManualPeople(),
    ctx.user.getManualPlaces(),
  ])

  // These are not simple objects, but Sequilize special objects
  // We need to extract pure user data from them
  return [
    ...wrappedFollowings.map(wrapped => {
      const following = wrapped.get({ plain: true })
      // Privacy!
      delete following.email
      delete following.twitterId

      following.__resolveType = 'User'
      return following
    }),
    ...wrappedPeople.map(wrapped => {
      const person = wrapped.get({ plain: true })
      person.__resolveType = 'ManualPerson'
      return person
    }),
    ...wrappedPlaces.map(wrapped => {
      const place = wrapped.get({ plain: true })

      if (!place.photoUrl) {
        // Add the flag if it has no photo
        const locationParts = place.fullLocation.split(',')
        const countryName = locationParts[locationParts.length - 1]
        place.countryFlag = flag(countryName)
      }

      place.__resolveType = 'ManualPlace'
      return place
    }),
  ]
}
