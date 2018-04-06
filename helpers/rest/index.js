import { Router } from 'express'

// Controllers
import uploadManualPhoto from './uploadManualPhoto'

const router = Router()
export default router

// API Intro!
router.get('/', (req, res) => {
  res.send('REST API for There! 😴 REST?')
})

// Submit events from the app
router.post('/upload-manual-photo', ...uploadManualPhoto())
