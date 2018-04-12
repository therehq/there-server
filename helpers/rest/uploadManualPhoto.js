import passport from 'passport'
import multer from 'multer'
import Raven from 'raven'
import sharp from 'sharp'
import path from 'path'

// Utilities
import { uploadToStorageMiddleware } from '../google/uploadToStorage'

const allowedExtensions = ['.png', '.jpg', '.gif', '.jpeg']
const multipart = multer({
  limits: {
    fileSize: 2048 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const extension = (path.extname(file.originalname) || '').toLowerCase()
    // Check if it is an image
    if (!allowedExtensions.includes(extension)) {
      return cb(new Error('Only images are allowed.'))
    }
    cb(null, true)
  },
})

export default () => [
  passport.authenticate('jwt'),
  multipart.single('photo'),
  resizePhoto,
  uploadToStorageMiddleware(),
  async (req, res) => {
    const { file, body, userId } = req

    // File was successfully uploaded, pass the
    // uploaded file details to the client
    res.json({
      publicUrl: file.cloudStoragePublicUrl,
      object: file.cloudStorageObject,
    })
  },
]

async function resizePhoto(req, res, next) {
  try {
    req.file.buffer = await sharp(req.file.buffer)
      .resize(84, 84)
      .toBuffer()
    next()
  } catch (err) {
    console.log(err)
    Raven.captureException(err)
    next(err)
  }
}
