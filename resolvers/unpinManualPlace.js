import { ManualPlace } from '../models'

export default async (obj, { id }, ctx) => {
  const [affected] = await ManualPlace.update(
    { pinned: false, pinnedAt: null },
    { where: { id } },
  )

  if (affected === 1) {
    // Later if we had a better caching in the app,
    // we should return the updated row
    return { pinned: false }
  }

  // Nothing affected
  return null
}
