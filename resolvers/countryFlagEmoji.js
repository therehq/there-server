import { flag as getFlagEmoji } from 'country-emoji'
import config from '../utils/config'

export default (obj, args, ctx) => {
  const { fullLocation } = obj

  if (!fullLocation) {
    return null
  }

  let locationParts
  if (fullLocation.includes(',')) {
    locationParts = fullLocation.split(',')
  } else if (fullLocation.includes('-')) {
    locationParts = fullLocation.split('-')
  } else {
    locationParts = fullLocation
  }

  const countryName = locationParts[locationParts.length - 1]

  return getFlagEmoji(countryName)
}
