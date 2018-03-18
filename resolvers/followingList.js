import getFieldNames from 'graphql-list-fields'
import { flag } from 'country-emoji'
import compact from 'lodash/compact'

export default async (obj, args, ctx, info, followingsOrderProp) => {
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

  // Fetch
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

  // Normlize and group data
  const unsortedPeople =
    needsPeople &&
    [
      ...wrappedFollowings.map(wrapped => prepareUser(wrapped)),
      ...wrappedManualPeople.map(wrapped => prepareManualPerson(wrapped)),
    ].sort((a, b) => a.createdAt - b.createdAt)

  const unsortedPlaces =
    needsPlaces &&
    wrappedManualPlaces.map(wrapped => prepareManualPlace(wrapped))

  // Sort
  const followingsOrder = await getCurrentFollowingsOrder(
    followingsOrderProp,
    ctx,
  )
  const { peopleIds, personIds } = followingsOrder || {}

  const people = sortByOrder(unsortedPeople, peopleIds)
  const places = sortByOrder(unsortedPlaces, personIds)

  // Return finilized data!
  const followings = { places, people }
  return followings
}

async function getCurrentFollowingsOrder(fromProp, ctx) {
  if (fromProp) {
    return fromProp
  } else {
    const wrapped = await ctx.user.getFollowingsOrder()
    return wrapped && wrapped.get({ plain: true })
  }
}

function sortByOrder(list, idsInOrder) {
  // If there's no order, just return the list!
  if (!idsInOrder) {
    return list
  }

  const byId = {}
  const allIds = []
  // Normalize the data
  for (let item of list) {
    allIds.push(item.id)
    byId[item.id] = item
  }

  const sortedItems = idsInOrder.map(id => {
    // Remove this item from byId, so we know
    // it has been sorted
    const item = byId[id]
    byId[id] = null
    return item
  })

  // Find whatever is not sorted and add them at the end
  const unsortedItems = compact(allIds.map(id => byId[id]))

  return [...sortedItems, ...unsortedItems]
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
