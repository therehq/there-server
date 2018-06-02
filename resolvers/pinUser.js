import config from '../utils/config'
import { countPinned } from './shared/countPinned'

export default async (obj, args, ctx, info) => {
  const pinnedCount = await countPinned(ctx.user)

  if (pinnedCount >= config.maxPinned) {
    return new Error('Max pinned limit reached')
  }

  // Pin
  await ctx.user.addPinnedUsers(args.userId)
  return { userId: args.userId }
}
