import { mixpanel } from '../helpers/mixpanel'

export default async (obj, args, ctx, info) => {
  const userId = ctx.userId

  try {
    mixpanel.track('Delete Account', {
      distinct_id: userId,
      userId,
    })
  } catch (err) {
    console.error(err)
  }

  // Delete user and its data
  await ctx.user.destroy({ force: true })
  return true
}
