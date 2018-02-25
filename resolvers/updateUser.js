export default async (obj, args, ctx) => {
  const [affected] = await ctx.models.User.update(args, {
    where: { id: ctx.userId },
  })
  // Return user
  if (affected === 1) {
    const user = await ctx.models.User.findById(ctx.userId)
    return user.dataValues
  }
  // Nothing affected
  return {}
}
