import { code as getCode } from 'country-emoji'
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

  // Check the last part for country name
  let countryName = locationParts[locationParts.length - 1]

  let code = getCode(countryName)

  if (!code) {
    if (locationParts.length >= 3) {
      // Check the second part for country name
      countryName = locationParts[locationParts.length - 2]
      code = getCode(countryName)

      if (!code) {
        return null
      }
    } else {
      return null
    }
  }

  return `${config.apiUrl}/static/assets/country-flags-${
    config.countryFlagsHash
  }/${code}.svg`
}
