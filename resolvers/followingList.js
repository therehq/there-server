export default async (obj, args, ctx) => {
  const wrappedFollowings = await ctx.user.getFollowing()
  // TODO: Get manual person and manual places

  // These are not simple objects, but Sequilize special objects
  // We need to extract pure user data from them
  return wrappedFollowings.map(wrapped => {
    const following = wrapped.get()
    delete following.email // Privacy!
    following.__resolveType = 'User'
    return following
  })
}
