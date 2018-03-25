import { FollowingsOrder } from '../models'
import followingList from './followingList'

export default async (obj, { peopleIds, placesIds }, ctx, info) => {
  const values = {}

  if (peopleIds) {
    values.peopleIds = JSON.stringify(peopleIds)
  }
  if (placesIds) {
    values.placesIds = JSON.stringify(placesIds)
  }

  let newFollowingsOrder

  // Check if we currently have an order record
  const currentOrder = await ctx.user.getFollowingsOrder()

  if (currentOrder) {
    // Save it before updating, since .update, mutates
    // `currentOrder` data!
    const futureFollowingsOrder = {
      peopleIds: peopleIds || currentOrder.get('peopleIds'),
      placesIds: placesIds || currentOrder.get('placesIds'),
    }
    // Update the current order
    await currentOrder.update(values)
    // Set reserved data to pass to followingList resolver
    newFollowingsOrder = futureFollowingsOrder
  } else {
    // Create a new order record!
    const followingsOrder = FollowingsOrder.build(values)
    await ctx.user.setFollowingsOrder(followingsOrder)
    newFollowingsOrder = followingsOrder.get({ plain: true })
  }

  return await followingList(null, null, ctx, info, newFollowingsOrder)
}
