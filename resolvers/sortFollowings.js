import { User } from '../models'
import followingList from './followingList'

export default async (obj, { peopleIds, placesIds, timestamp }, ctx, info) => {
  return await followingList(null, null, ctx, info)
}
