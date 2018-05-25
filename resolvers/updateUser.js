export default async (obj, args, ctx) => {
  if (args.email) {
    const userWithEmail = await ctx.models.User.findOne({
      where: { email: args.email },
    })
    if (userWithEmail) {
      const registeredEmail = args.email
      delete args.email
      throw new Error(`${registeredEmail} is registered. Sign in by email!`)
    }
  }

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
