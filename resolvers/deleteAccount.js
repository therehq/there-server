export default async (obj, args, ctx, info) => {
  // Delete user and its data
  await ctx.user.destroy({ force: true })
  return true
}
