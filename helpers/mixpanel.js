import Mixpanel from 'mixpanel'

// Utilities
import config from '../utils/config'

export const mixpanel = Mixpanel.init(config.mixpanelProjectToken)
