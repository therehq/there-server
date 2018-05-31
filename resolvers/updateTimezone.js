export default async (obj, args, ctx) => {
  // Check if email is already registered
  const [affected] = await ctx.models.User.update(
    { timezone: args.timezone, city: '', fullLocation: '' },
    {
      where: { id: ctx.userId },
    },
  )

  // Return user
  if (affected === 1) {
    const user = await ctx.models.User.findById(ctx.userId)
    return user.dataValues
  }

  // Nothing affected
  return null
}
