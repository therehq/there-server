import { ManualPlace } from '../models'
import { countPinned } from './shared/countPinned'
import config from '../utils/config'

export default async (obj, { id }, ctx) => {
  const pinnedCount = await countPinned(ctx.user)

  if (pinnedCount >= config.maxPinned) {
    return new Error('Max pinned limit reached')
  }

  const [affected] = await ManualPlace.update(
    { pinned: true, pinnedAt: Date.now() },
    { where: { id } },
  )

  if (affected === 1) {
    // Later if we had a better caching in the app,
    // we should return the updated row
    return { pinned: true }
  }

  // Nothing affected
  return null
}
