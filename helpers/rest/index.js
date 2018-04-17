import { Router } from 'express'

// Controllers
import uploadManualPhoto from './uploadManualPhoto'
import twivatar from './twivatar'

const router = Router()
export default router

// API Intro!
router.get('/', (req, res) => {
  res.send('REST API for There! 😴 REST?')
})

router.post('/upload-manual-photo', ...uploadManualPhoto())
router.get('/twivatar/:user', twivatar)
