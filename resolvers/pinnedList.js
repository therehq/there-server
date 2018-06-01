import flatten from 'lodash/flatten'

// Utilities
import { types as showLocPolicyTypes } from '../helpers/privacy/showLocationPolicy'

export default async (obj, args, ctx, info) => {
  const pinnedManualPeople = () =>
    ctx.user.getManualPeople({ where: { pinned: true } })
  const pinnedManualPlaces = () =>
    ctx.user.getManualPlaces({ where: { pinned: true } })
  const pinnedUsers = () => ctx.user.getPinnedUsers()

  const [rawManualPeople, rawManualPlaces, rawUsers] = await Promise.all([
    pinnedManualPeople(),
    pinnedManualPlaces(),
    pinnedUsers(),
  ])

  const manualPeople = rawManualPeople.map(prepareManualPerson)
  const manualPlaces = rawManualPlaces.map(prepareManualPlace)
  const users = rawUsers.map(prepareUser)

  let list = [...manualPeople, ...manualPlaces, ...users]

  list.sort((a, b) => b.pinnedAt - a.pinnedAt)

  return list
}

function prepareUser(wrappedUser) {
  const user = wrappedUser.get({ plain: true })

  // Set pinnedAt
  const pinnedAt = wrappedUser.get(`userPinneds`).get(`createdAt`)
  user.pinnedAt = pinnedAt

  // Privacy!
  if (
    user.showLocationPolicy &&
    user.showLocationPolicy === showLocPolicyTypes.NEVER
  ) {
    delete user.city
    delete user.fullLocation
  }
  delete user.email
  delete user.twitterId

  // Add the type for GraphQL
  user.__resolveType = 'User'
  return user
}

function prepareManualPerson(wrappedManualPerson) {
  const manualPerson = wrappedManualPerson.get({ plain: true })

  manualPerson.__resolveType = 'ManualPerson'
  return manualPerson
}

function prepareManualPlace(wrappedManualPlace) {
  const place = wrappedManualPlace.get({ plain: true })

  place.__resolveType = 'ManualPlace'
  return place
}
