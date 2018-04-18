import { Router } from 'express'

const router = Router()

// API Intro!
router.get('/', (req, res) => {
  res.send('Analytics API for There! 🔄 / ⚠️ Deprecated')
})

// ⚠️ MAINTAIN Mode - using mixpanel instead
// Submit events from the app
router.post('/event', async (req, res) => {
  // Send the response
  res.json({ ok: true, analyticsEvent: {}, message: '⚠️ Deprecated' })
})

export default router
