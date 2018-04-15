import { ManualPerson } from '../models'

export default async (obj, args, ctx) => {
  if (!args.id) {
    throw new Error('No Person ID was sent.')
  }

  const person = await ManualPerson.findById(args.id)

  if (!person) {
    throw new Error('No person matched the ID.')
  }

  return person.get({ plain: true })
}
