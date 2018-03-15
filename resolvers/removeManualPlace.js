import { User } from '../models'
import followingList from './followingList'

export default async (obj, { id }, ctx) => {
  // Remove place
  await ctx.user.removeManualPlace(id)

  return await followingList(null, null, ctx)
}
