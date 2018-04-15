import { ManualPlace } from '../models'

export default async (obj, args, ctx) => {
  if (!args.id) {
    throw new Error('No place ID was sent.')
  }

  const place = await ManualPlace.findById(args.id)

  if (!place) {
    throw new Error('No place matched the ID.')
  }

  return place.get({ plain: true })
}
