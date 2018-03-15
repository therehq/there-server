import { User } from '../models'
import followingList from './followingList'

export default async (obj, { id }, ctx) => {
  // Remove person
  await ctx.user.removeManualPerson(id)

  return await followingList(null, null, ctx)
}
