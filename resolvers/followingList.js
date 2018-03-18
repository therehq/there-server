import { flag } from 'country-emoji'

export default async (obj, args, ctx) => {
  const [
    wrappedFollowings,
    wrappedManualPeople,
    wrappedManualPlaces,
  ] = await Promise.all([
    ctx.user.getFollowing({ order: [['createdAt', 'ASC']] }),
    ctx.user.getManualPeople({ order: [['createdAt', 'ASC']] }),
    ctx.user.getManualPlaces({ order: [['createdAt', 'ASC']] }),
  ])
  //{ order: [['createdAt', 'ASC']] }
  // These are not simple objects, but Sequilize special objects
  // We need to extract pure user data from them
  const people = [
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

  const places = wrappedManualPlaces.map(wrapped => {
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
