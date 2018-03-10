import { flag } from 'country-emoji'
import { Op } from 'sequelize'
import { User } from '../models'

export default async (obj, args, ctx) => {
  const users = await User.findAll({
    where: { fullName: { [Op.like]: `%${args.name.split(' ').join('%')}%` } },
    limit: args.limit || undefined,
  })

  return users.map(wrappedUser => {
    const user = wrappedUser.get({ plain: true })

    // Add the flag
    const locationParts = user.fullLocation.split(',')
    const countryName = locationParts[locationParts.length - 1]
    user.countryFlag = flag(countryName)

    // Privacy!
    delete user.email
    delete user.twitterId
    return user
  })
}
