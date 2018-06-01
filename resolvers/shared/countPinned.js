import { ManualPerson, ManualPlace } from '../../models'

export const countPinned = async user => {
  const pinnedManualPeople = () =>
    user.countManualPeople({ where: { pinned: true } })
  const pinnedManualPlaces = () =>
    user.countManualPlaces({ where: { pinned: true } })
  const pinnedUsers = () => user.countPinnedUsers()

  const counts = await Promise.all([
    pinnedManualPeople(),
    pinnedManualPlaces(),
    pinnedUsers(),
  ])

  return counts.reduce((sum, c) => sum + c, 0)
}
