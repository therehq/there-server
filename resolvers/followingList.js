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

  const people =
    needsPeople &&
    [
      ...wrappedFollowings.map(wrapped => prepareUser(wrapped)),
      ...wrappedManualPeople.map(wrapped => prepareManualPerson(wrapped)),
    ].sort((a, b) => a.createdAt - b.createdAt)

  const places =
    needsPlaces &&
    wrappedManualPlaces.map(wrapped => prepareManualPlace(wrapped))

  const followings = { places, people }
  return followings
}

function prepareUser(wrappedUser) {
  const followedUser = wrappedUser.get({ plain: true })
  // CreatedAt is for the user not the followings, let's
  // override it with the actual followed time
  const followedAt = wrappedUser.get(`userFollowings`).get(`createdAt`)
  followedUser.createdAt = followedAt
  // Privacy!
  delete followedUser.email
  delete followedUser.twitterId
  // Add the type for GraphQL
  followedUser.__resolveType = 'User'
  return followedUser
}

function prepareManualPerson(wrappedManualPerson) {
  const manualPerson = wrappedManualPerson.get({ plain: true })
  manualPerson.__resolveType = 'ManualPerson'
  return manualPerson
}

function prepareManualPlace(wrappedManualPlace) {
  const place = wrappedManualPlace.get({ plain: true })

  if (!place.photoUrl && place.fullLocation) {
    // Add the flag if it has no photo
    const locationParts = place.fullLocation.split(',')
    const countryName = locationParts[locationParts.length - 1]
    place.countryFlag = flag(countryName)
  }

  place.__resolveType = 'ManualPlace'
  return place
}
