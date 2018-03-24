import { Router } from 'express'

// Utilities
import { allEventTypes } from './types'
import { AnalyticsEvent, User } from '../../models'

const router = Router()

// API Intro!
router.get('/', (req, res) => {
  res.send('Analytics API for There! 🔄')
})

// Submit events from the app
router.post('/event', async (req, res) => {
  const { userId } = req
  const { type, ...rest } = req.body

  // Check for type
  if (!type) {
    res.status(500).json({ error: 'Type is not provided.' })
    return
  } else if (!allEventTypes.includes(type)) {
    res.status(500).json({ error: 'Type is invalid!' })
    return
  }

  // Save the event
  const analyticsEvent = await AnalyticsEvent.create({ type, ...rest })

  // Attach to user if request is authorized
  if (userId) {
    const user = await User.findById(userId)
    await user.addAnalyticsEvent(analyticsEvent)
  }

  // Send the response
  res.json({
    ok: true,
    analyticsEvent: analyticsEvent.get({ plain: true }),
  })
})

export default router
