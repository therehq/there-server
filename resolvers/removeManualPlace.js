import { User } from '../models'
import followingList from './followingList'

export default async (obj, { id }, ctx, info) => {
  // Remove place
  await ctx.user.removeManualPlace(id)

  return { id }
}
