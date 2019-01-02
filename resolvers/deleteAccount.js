import { mixpanel } from '../helpers/mixpanel'

export default async (obj, args, ctx, info) => {
  const userId = ctx.userId

  if (!ctx.user) {
    return new Error('No user')
  }

  try {
    mixpanel.track('Delete Account', {
      distinct_id: userId,
      userId,
    })
  } catch (err) {
    console.log(err)
  }

  // Delete user and its data
  await ctx.user.destroy({ force: true })
  return true
}
